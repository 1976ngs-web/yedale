import cv2, numpy as np
Y0 = 700
OX = 400
CW = 941 + 2 * OX
CH = 1672 - Y0


def warp(wd, M):
    """wide art -> canvas in frame coords (canvas u = frame x + OX, v = frame y - Y0)"""
    Wd = cv2.imread(wd)
    A = np.array([[1, 0, -OX], [0, 1, 0], [0, 0, 1]], np.float32)
    MM = (np.vstack([M, [0, 0, 1]]) @ A)[:2]
    out = cv2.warpAffine(Wd, MM, (CW, CH), flags=cv2.WARP_INVERSE_MAP | cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 0, 255))
    valid = cv2.warpAffine(np.full(Wd.shape[:2], 255, np.uint8), MM, (CW, CH),
                           flags=cv2.WARP_INVERSE_MAP | cv2.INTER_NEAREST, borderValue=0)
    return out, valid


def checker(E, F, blk=60):
    C = E.copy()
    for y in range(0, F.shape[0], blk):
        for x in range(0, 941, blk):
            if ((x // blk) + (y // blk)) % 2 == 0:
                f = F[y:y + blk, x:x + blk]
                C[y:y + f.shape[0], OX + x:OX + x + f.shape[1]] = f
    return C
