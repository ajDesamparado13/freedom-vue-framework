const mobile = {
    mobileMaxWidth:850,
    isMobile(){
        return this.isAnyOs() || document.body.clientWidth < this.mobileMaxWidth
    },
    version: {
        iOS: function () {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            }
            return null;
        }
    },
    isAnyOs(){
        return this.isAndroid() || this.isBlackBerry() || this.isIOS ()|| this.isOpera() || this.isWindows() 
    },
    isAndroid(){
        return (
            typeof window !== 'undefined' &&
            window.navigator.userAgent.match(/Android/i)
        )
    },
    isBlackBerry(){
        return (
            typeof window !== 'undefined' &&
            window.navigator.userAgent.match(/BlackBerry/i)
        )
    },
    isIOS(){
        return (
            typeof window !== 'undefined' &&
            window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
        )
    },
    isOpera(){
        return (
            typeof window !== 'undefined' &&
            window.navigator.userAgent.match(/Opera Mini/i)
        )
    },
    isWindows() {
        return (
            typeof window !== 'undefined' &&
            window.navigator.userAgent.match(/IEMobile/i)
        )
    },
}

export default function (Vue) {
    if(Vue._mobile){
        return;
    }
    Vue._mobile = mobile,
    Object.defineProperties(Vue.prototype,{
        $_mobile:{
            get:() => {
                return Vue._mobile;
            }
        }
    })
}
