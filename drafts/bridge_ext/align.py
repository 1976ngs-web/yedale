import cv2, numpy as np, sys
# frame coords (xf,yf) -> wide coords: xw = a*xf + b*yf + c ...
Y0 = 700  # top of the frame region we care about


def align(fr, wd):
    F = cv2.imread(fr)
    Wd = cv2.imread(wd)
    T = F[Y0:1672]
    H, Wf = T.shape[:2]
    # initial guess from template match: s=.98, frame (0,1029) -> wide (376,289)
    M0 = np.array([[0.98, 0, 376], [0, 0.98, 289 - 0.98 * (1029 - Y0)]], np.float32)
    g = lambda im: cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 2)
    tg = g(T)
    # input warped back into template space with inverse map uses findTransformECC semantics:
    # ECC finds W such that input(W(x)) ~ template(x); input must be same size -> pad wide into big canvas
    big = np.zeros((max(H, Wd.shape[0]), max(Wf, Wd.shape[1]), 3), np.uint8)
    big[:Wd.shape[0], :Wd.shape[1]] = Wd
    ig = g(big)
    mask = np.zeros((H, Wf), np.uint8)
    mask[:, :220] = 255
    mask[:, Wf - 220:] = 255
    # ECC requires same size: crop/pad template to big size
    tb = np.zeros(ig.shape, np.float32); tb[:H, :Wf] = tg
    mb = np.zeros(ig.shape, np.uint8); mb[:H, :Wf] = mask
    cc, M = cv2.findTransformECC(tb, ig, M0.copy(), cv2.MOTION_AFFINE,
                                 (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 500, 1e-7), mb, 5)
    return cc, M


if __name__ == '__main__':
    for fr, wd, out in [('br_P_14_complete.webp', 'bridge_wide_v1.png', 'Mc.npy'),
                        ('br_P_00_collapsed.webp', 'bridge_wide_collapsed_v1.png', 'Mk.npy')]:
        cc, M = align(fr, wd)
        print(wd, round(cc, 4)); print(M)
        np.save(out, M)
