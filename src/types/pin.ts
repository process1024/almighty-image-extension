export type CheckFilePin = {
  pin: {
    pin_id: number;
    user_id: number;
    board_id: number;
    file_id: number;
    file: {
      bucket: string;
      key: string;
      type: string;
      width: number;
      height: number;
      frames: number;
      theme: string;
    };
    media_type: number;
    source: string;
    link: string;
    raw_text: string;
    text_meta: object;
    via: number;
    via_user_id: number;
    original: null;
    created_at: number;
    like_count: number;
    comment_count: number;
    repin_count: number;
    is_private: number;
    extra: null;
    orig_source: null;
    tags: string[];
    board: {
      board_id: number;
      user_id: number;
      title: string;
      description: string;
      category_id: null;
      seq: number;
      pin_count: number;
      follow_count: number;
      like_count: number;
      created_at: number;
      updated_at: number;
      deleting: number;
      is_private: number;
      extra: null;
    };
  };
  waring?: number;
};

/** 采集方式 */
export type PinSource =
  | '右键采集'
  | '采集按钮采集'
  | '拖拽采集'
  | '快采'
  | '拖拽快采'
  | '截图采集'
  | '截图快采'
  | '可视区域采集'
  | '整张截图采集'
  | '批量采集';
