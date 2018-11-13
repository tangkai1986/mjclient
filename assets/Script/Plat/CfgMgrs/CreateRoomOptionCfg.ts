import BaseCfg from "../Libs/BaseCfg"
import RoomMgr from "../GameMgrs/RoomMgr";

export default class CreateRoomOptionCfg extends BaseCfg {
  private CreateRoomOptionPth = null;
  private data = null;
  constructor() {
    super();
    this.CreateRoomOptionPth = this.getFullPath('createroomoption');
  }

  private static _instance: CreateRoomOptionCfg;
  public static getInstance(): CreateRoomOptionCfg {
    if (!this._instance) {
      this._instance = new CreateRoomOptionCfg();
    }
    return this._instance;
  }
  
  getNNOption(gameId) {
    return this.data[gameId];
  }

  loadCb(name, data) {
    this.loaded = true;
    this.data = data;
  }
  load() {
    //先去判断有几个游戏要加载
    this.loadRes(this.CreateRoomOptionPth, this.loadCb);
  }
}