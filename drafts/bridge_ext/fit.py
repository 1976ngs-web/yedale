import cv2, numpy as np


def fit_to(gen, ref, mask_cols=None):
    """Resize a ChatGPT edit back to the reference crop size and refine its
    position with an ECC affine fit (on the columns given)."""
    G = cv2.resize(gen, (ref.shape[1], ref.shape[0]), interpolation=cv2.INTER_AREA)
    g = lambda im: cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32), (0, 0), 1.5)
    m = np.zeros(ref.shape[:2], np.uint8)
    if mask_cols is None:
        m[:] = 255
    else:
        m[:, mask_cols[0]:mask_cols[1]] = 255
    M = np.eye(2, 3, dtype=np.float32)
    cc, M = cv2.findTransformECC(g(ref), g(G), M, cv2.MOTION_AFFINE,
                                 (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 300, 1e-6), m, 5)
    out = cv2.warpAffine(G, M, (ref.shape[1], ref.shape[0]), flags=cv2.WARP_INVERSE_MAP | cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_REPLICATE)
    return cc, M, out
