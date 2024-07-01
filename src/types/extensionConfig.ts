export interface ExtensionConfig {
  latestVersion: string;
  background: {
    name: string;
    url: string;
    uid: string;
  }[];
  backgroundJump: string;
  backgroundMark: string;
  backgroundMarkJump: string;
  batchPin: {
    minWidth: number;
    minHeight: number;
  };
  block: {
    domain: string;
  }[];
  btnPositions: {
    domain: {
      domain: string;
    }[];
    btnPosition: string;
  }[];
  hoverImgPositionSite: {
    domain: string;
  }[];
  pinBtnDelaySite: {
    domain: string;
  }[];
  entries: {
    img: {
      name: string;
      url: string;
      uid: string;
    };
    name: string;
    link: string;
  }[];
}
