import { defineStore } from 'pinia';
export interface UserInfo {
  userId: number;
  username: string;
  nickname?: string;
}

export const useUser = defineStore('user',{
  persist: {
    storage: localStorage,
  },
  state: () => {
    return {
      data: {
        token: '',
        userInfo: {
          userId: null,
          username: '',
        } as unknown as UserInfo,
      }
    }
  },
  getters: {
    userId: (state) => state.data.userInfo.userId,
    username: (state) => state.data.userInfo.username,
  },
  actions: {
    isLogin(){
      if(!this.getToken()){
        return false;
      }
      return this.userId ? true : false;
    },
    getUserInfo() {
      return this.data.userInfo;
    },
    getUserId() {
      if(!this.isLogin()){
        return '';
      }
      return this.data.userInfo.userId;
    },
    getToken() {
      return this.data.token;
    },
    setToken(token: string) {
      this.data.token = token;
    },
    setUserInfo(userInfo: UserInfo) {
      return this.data.userInfo = userInfo;
    },
    async logout() {
      this.data.token = '';
      this.data.userInfo.userId = null as any;
      this.data.userInfo.nickname = '';
      this.data.userInfo.username = '';
    },
    async refreshPermission(): Promise<void> {
    }
  }
});