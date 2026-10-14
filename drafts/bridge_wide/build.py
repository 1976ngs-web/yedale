import cv2,numpy as np,glob,os
def affine(Wp,Cp):
  W=cv2.imread(Wp);C=cv2.imread(Cp);s=cv2.SIFT_create(4000)
  k1,d1=s.detectAndCompute(cv2.cvtColor(C,cv2.COLOR_BGR2GRAY),None);k2,d2=s.detectAndCompute(cv2.cvtColor(W,cv2.COLOR_BGR2GRAY),None)
  m=cv2.BFMatcher().knnMatch(d1,d2,k=2);g=[a for a,b in m if a.distance<.7*b.distance]
  p1=np.float32([k1[a.queryIdx].pt for a in g]);p2=np.float32([k2[a.trainIdx].pt for a in g])
  M,inl=cv2.estimateAffinePartial2D(p1,p2,ransacReprojThreshold=3);return M,int(inl.sum()),W.astype(np.float32),C.astype(np.float32)
OX,OY,CW,CH=390,1,1719,967
def surround(Wp,Cp):
  M,n,W,C=affine(Wp,Cp);sc=np.hypot(M[0,0],M[1,0]);print(os.path.basename(Wp),'inliers',n,'scale',round(sc,4),'t',M[:,2].round(1))
  A=np.array([[sc,0,M[0,2]-sc*OX],[0,sc,M[1,2]-sc*OY]],np.float32)
  G=cv2.warpAffine(W,A,(CW,CH),flags=cv2.INTER_CUBIC|cv2.WARP_INVERSE_MAP,borderMode=cv2.BORDER_REFLECT)
  ov=G[OY:OY+941,OX:OX+941];gain=(C.reshape(-1,3).mean(0)+1)/(ov.reshape(-1,3).mean(0)+1);return np.clip(G*gain,0,255)
F=40;r=np.minimum(np.arange(941),np.arange(941)[::-1]).astype(np.float32)
m=np.clip(r/F,0,1)[None,:]*np.clip((940-np.arange(941))/F,0,1)[:,None]
S={'c':surround('/mnt/user-data/uploads/Downloads/bridge_wide_v1.png','/root/yedale/drafts/bridge_wide/center_complete.png')
}
os.makedirs('out',exist_ok=True)
for f in sorted(glob.glob('/root/yedale/public/pics/bridge_seq/br_P_*.webp')):
  n=os.path.basename(f)[5:-5];key='c'
  sq=cv2.imread(f)[731:1672].astype(np.float32);out=S[key].copy()
  out[OY:OY+941,OX:OX+941]=out[OY:OY+941,OX:OX+941]*(1-m[...,None])+sq*m[...,None]
  cv2.imwrite('out/br_W_%s.png'%n,out.astype(np.uint8))
print('done')
