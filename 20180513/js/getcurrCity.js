//获取当前城市
(function(){
    var url = location.href.split('#')[0];
    $.ajax({
        type:"post",
        url:Config.url+"/getJsApiInfo",
        data:{
            url:url
        },
        beforeSend:function(xhr, settings){
        },
        success:function(data, status, xhr){
            if(data.resultCode=='0000'){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.object.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: parseInt(data.object.timestamp,10), // 必填，生成签名的时间戳
                    nonceStr: data.object.nonceStr, // 必填，生成签名的随机串
                    signature: data.object.signature,// 必填，签名，见附录1
                    jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function(){
                    //alert('ready');
                    wx.getLocation({
                        success: function (res) {
                            var getAddressUrl = "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location="+res.latitude+","+res.longitude+"&output=json&pois=1&ak="+Config.baiduAk;
                            //alert(res.latitude+","+res.longitude);
                            $.ajax({
                                type:"get",
                                url:getAddressUrl,
                                dataType:'jsonp',
                                beforeSend:function(xhr, settings){
                                },
                                success:function(data, status, xhr){
                                    console.log(data);
                                    //alert(data.result.addressComponent.city);
                                    if(data.result.addressComponent.city&&$('.addCity')[0]){
                                        $('.addCity').text(data.result.addressComponent.city);
                                    }
                                },
                                error:function(xhr, errorType, error){
                                    console.log(errorType);
                                    $('.addCity').text('深圳');
                                },
                                complete:function(xhr, status){
                                }
                            });
                        },
                        fail: function(error) {
                            //AlertUtil.error("获取地理位置失败，请确保开启GPS且允许微信获取您的地理位置！");
                            $('.addCity').text('深圳');
                        }
                    });
                });
                wx.error(function(res){
                });
            }else{
                $('.addCity').text('深圳');
            }
        },
        error:function(xhr, errorType, error){
            $('.addCity').text('深圳');
        },
        complete:function(xhr, status){
        }
    });
    function renderReverse(data){//反地址编码回调
    }
})();