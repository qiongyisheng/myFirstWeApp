//index.js
//获取应用实例
const app = getApp()

var model = require('../../model/areaModel.js')

var show = false;
var item = {};
var date;
var hidden = true;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: [],
    toast1Hidden: true,
    modalHidden: true,
    modalHidden2: true,
    notice_str: '',
    index: 0,
    date: date,
    item: {
      show: show
    },
    hidden: hidden,
    minDate: new Date(1900, 1, 1).getTime(),
    maxDate: new Date(2230, 1, 1).getTime(),
    currentDate: new Date().getTime()
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toast1Change: function (e) {
    this.setData({ toast1Hidden: true });
  },
  //弹出确认框
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  confirm_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
  },
  cancel_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  //弹出提示框
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  isCardNo: function(sId) 
  {
    var aCity = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"}
    
    var iSum = 0
    var info = ""
    if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) return "Error:非法地区";
    sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"))
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "Error:非法生日";
    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
    if (iSum % 11 != 1) return "Error:非法证号";
    return aCity[parseInt(sId.substr(0, 2))] + "," + sBirthday + "," + (sId.substr(16, 1) % 2 ? "男" : "女")
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log("formData: ", formData);
    // isCardNo(formData.sfznum);
    // wx.request({
    //   url: 'http://test.com:8080/test/socket.php?msg=2',
    //   data: formData,
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.modalTap();
    //   }
    // })
  },
  formReset: function () {
    console.log('form发生了reset事件');
    this.modalTap2();
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    console.log("id = " + e.target.dataset.id)
    model.animationEvents(this, 200, false, 400);
    //点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
    if (e.target.dataset.id == 666) {
      this.updateShowData()
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    //如果想滑动的时候不实时更新，只点确定的时候更新，注释掉下面这行代码即可。
    this.updateShowData()
  },
  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  }
  ,
  onReachBottom: function () {
  },
  nono: function () { },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  showpopup: function () {
    console.log("Click button");
    if (!this.display) {
      this.display = true;
    } else {
      this.display = false;
    }
  },
  formatter: function (type, value) {
    if (type === 'year') {
      return `${value}年`;
    } else if (type === 'month') {
      return `${value}月`
    } else if (type === 'day') {
      return `${value}日`
    }
    return value;
  },
  onInput(event) {
    const { detail, currentTarget } = event;
    const result = new Date(detail).toLocaleDateString();
  },
  onChange(event) {
    this.setData({
      currentDate: event.detail.value
    });
  }
  
})
