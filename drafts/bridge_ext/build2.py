"""Side extensions for the bridge game on wide screens.
Left art: ChatGPT wide outpaint (aligned, colour matched).
Right art: ChatGPT seam-fix crop (aligned) - keeps the front post whole.
Seams are found per row inside the frame's edge band where art and frame
agree best; pixels that change between the frames are never covered.
Output RGBA webp in frame coords: x from -XL .. XR, y from Y_A .. 1672."""
import cv2, numpy as np, glob
from bx import warp, OX, Y0

SEQ = '/home/claude/yedale/public/pics/bridge_seq/'
XL, XR = 400, 1316
YA, YB = 1024, 1672
CW, CH = XL + XR, YB - YA
FE = 6


def dp_seam(cost, step=2):
    Hh, N = cost.shape
    acc = cost.copy(); bk = np.zeros((Hh, N), np.int32)
    idx = np.arange(N)
    for y in range(1, Hh):
        best = np.full(N, np.inf); arg = np.zeros(N, np.int32)
        for s in range(-step, step + 1):
            sh = np.full(N, np.inf)
            if s < 0: sh[:s] = acc[y - 1][-s:]
            elif s > 0: sh[s:] = acc[y - 1][:-s]
            else: sh = acc[y - 1].copy()
            m = sh < best; best[m] = sh[m]; arg[m] = idx[m] - s
        acc[y] = cost[y] + best; bk[y] = arg
    p = np.zeros(Hh, np.int32); p[-1] = int(np.argmin(acc[-1]))
    for y in range(Hh - 1, 0, -1): p[y - 1] = bk[y][p[y]]
    return p


def art_canvas():
    A = np.load('Ac.npy')                      # canvas x -OX.., y Y0..
    art = np.zeros((CH, CW, 3), np.uint8)
    art[:, :] = A[YA - Y0:YB - Y0, OX - XL:OX - XL + CW] if A.shape[1] >= OX - XL + CW else 0
    left = A[YA - Y0:YB - Y0, OX - XL:OX + 470]
    art[:, :XL + 470] = left
    R = cv2.imread('fixR_c_fit.png')           # frame x 661..1316, y 1029..1669
    R = cv2.copyMakeBorder(R, 1029 - YA, YB - 1669, 0, 0, cv2.BORDER_REPLICATE)
    art[:, XL + 661:XL + 1316] = R
    # blend the hand-over between the two sources at frame x 470..661 (hidden under the frame anyway)
    return art


def build(frames, out):
    art = art_canvas().astype(np.float32)
    Fs = [cv2.imread(SEQ + f)[YA:YB].astype(np.float32) for f in frames]
    F = Fs[-1]
    var = np.zeros(F.shape[:2], np.float32)
    for G in Fs:
        var = np.maximum(var, np.abs(G - F).mean(2))
    must = cv2.dilate((var > 10).astype(np.uint8), np.ones((15, 15), np.uint8)) > 0
    sl = np.s_[:, XL:XL + 941]
    d = np.abs(cv2.GaussianBlur(art[sl], (0, 0), 1.5) - cv2.GaussianBlur(F, (0, 0), 1.5)).mean(2)
    d[must] = 1e4
    k = cv2.blur(d, (9, 9))
    R_ = 8
    BL = 330
    dd = np.minimum(d, 60)
    cumL = np.cumsum(dd, 1)               # art covers [0, x)
    cumR = np.cumsum(dd[:, ::-1], 1)[:, ::-1]  # art covers [x, 941)
    AL = 0.02
    pl = dp_seam((k + AL * cumL)[:, R_:BL].copy()) + R_
    BR0 = 700
    pr = dp_seam((k + AL * cumR)[:, BR0:941 - R_].copy()) + BR0
    xs = (np.arange(CW)[None, :] - XL).astype(np.float32)
    aL = np.clip(0.5 + (pl[:, None] - xs) / (2 * R_), 0, 1)
    aR = np.clip(0.5 + (xs - pr[:, None]) / (2 * R_), 0, 1)
    mask = np.maximum(aL, aR)
    mask[:, :XL] = 1; mask[:, XL + 941:] = 1
    inside = np.zeros_like(mask, bool); inside[:, XL:XL + 941] = must
    mask[inside] = 0
    a = (mask * 255).round().astype(np.uint8)
    rgba = np.dstack([art.clip(0, 255).astype(np.uint8), a])
    cv2.imwrite(out, rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
    comp = art.copy()
    m3 = mask[:, XL:XL + 941, None]
    comp[sl] = F * (1 - m3) + art[sl] * m3
    rows = np.arange(len(pl))
    print(out, 'L seam', pl.min(), pl.max(), 'cost', round(float(k[rows, pl].mean()), 1),
          'R seam', pr.min(), pr.max(), 'cost', round(float(k[rows, np.clip(pr, 0, 940)].mean()), 1))
    return comp.astype(np.uint8)


if __name__ == '__main__':
    fr = sorted(f.split('/')[-1] for f in glob.glob(SEQ + '*.webp'))
    c = build(fr[2:], 'br_ext_c.webp'); cv2.imwrite('prev2_c.jpg', c)
    k = build(fr[:2], 'br_ext_k.webp'); cv2.imwrite('prev2_k.jpg', k)
