import { Injectable } from '@angular/core';
import { JPush } from '@jiguang-ionic/jpush';
import { Events, Platform } from 'ionic-angular';
import { STORAGE_CONSTANT } from '../config/storage';
import { Storage } from '@ionic/storage';
import { ENV as SERVER_CONFIG } from '@app/env';
import { AppVersion } from '@ionic-native/app-version';

@Injectable()
export class NotificationService {
  userId: any;
  serverConfig: object = SERVER_CONFIG;
  currentVersion: string;
  constructor(private jPush: JPush, private events: Events, private platform: Platform, private storage: Storage, private appVersion: AppVersion) {
    this.storage.get(STORAGE_CONSTANT.USER_ID).then(id => {
      if (id) this.userId = id;
    })
  }

  /**
 * 极光推送
 */
  initJpush () {
    if (this.platform.is('cordova') && this.platform.is('mobile')) {
      this.appVersion.getVersionNumber().then((version: string) => {
        this.currentVersion = version;
        this.jPush.init();
        this.setAlias();
        this.setTags([this.serverConfig['ENV'], this.currentVersion]);
        this.jPushAddEventListener();
      }).catch(error => {
        this.currentVersion = 'unknown';
      })
    }
  }

  private jPushAddEventListener () {
    // 判断用户是否开启了推送
    this.jPush.getUserNotificationSettings().then(result => {
      if (result == 0) {
        console.log('jpush-系统设置中已关闭应用推送');
      } else if (result > 0) {
        console.log('jpush-系统设置中打开了应用推送');
      }
    });

    // 获取registrationID
    this.jPush.getRegistrationID().then(result => {
      if (result) console.log('registrationID:' + result);
    })

    // 点击通知进入应用程序时会触发的事件
    document.addEventListener('jpush.openNotification', event => {
      this.setIosIconBadgeNumber(0);
      const content = this.platform.is('ios') ? event['aps'].alert : event['alert'];
      // 获取附加字段
      // const extras = event['extras'].key;
      this.events.publish('jpush.openNotification', content);
    }, false);

    // 收到通知时会触发该事件
    document.addEventListener('jpush.receiveNotification', event => {
      const content = this.platform.is('ios') ? event['aps'].alert : event['alert'];
      console.log(content)
    }, false);

    // 收到自定义消息时触发这个事件
    document.addEventListener('jpush.receiveMessage', event => {
      const message = this.platform.is('ios') ? event['content'] : event['message'];
      console.log(message)
    }, false);

  }

  setAlias () {
    if (this.platform.is('mobile')) {
      this.jPush.setAlias({ sequence: 1, alias: this.userId }).then(result => {
        console.log('jpush-设置别名成功:');
      }, (error) => {
        console.log('jpush-设置别名失败:' + error.code);
      });
    }
  }

  deleteAlias () {
    if (this.platform.is('mobile')) {
      this.jPush.deleteAlias({ sequence: 2 }).then(result => {
        console.log('jpush-删除别名成功');
      }, (error) => {
        console.log('jpush-设删除别名失败:' + error.code);
      });
    }
  }

  setTags (tags) {
    if (this.platform.is('mobile')) {
      this.jPush.setTags({ sequence: 3, tags }).then(result => {
        console.log('jpush-设置标签成功');
      }, (error) => {
        console.log('jpush-设置标签失败:' + error.code);
      });
    }
  }

  deleteTags (tags) {
    if (this.platform.is('mobile')) {
      this.jPush.deleteTags({ sequence: 4, tags }).then(result => {
        console.log('jpush-删除标签成功');
      }, (error) => {
        console.log('jpush-删除标签失败:' + error.code);
      });
    }
  }

  // 设置ios应用角标数量
  setIosIconBadgeNumber (badgeNumber) {
    if (this.platform.is('ios')) {
      this.jPush.setBadge(badgeNumber); // 上传badge值到jPush服务器
      this.jPush.setApplicationIconBadgeNumber(badgeNumber); // 设置应用badge值
    }
  }
}