LBGAnalytics.video = {};

LBGAnalytics.video.fix = function(){
  var $ = LBGAnalytics.$;

  var $broken = $("iframe[src*=youtube\\.com]").not("iframe[src*=www\\.youtube\\.com][src*=enablejsapi]");

  $broken.each(function(i,e){
    var $video = $(e);
    var url = $video.attr("src");
    if(url.indexOf("enablejsapi=1") < 0){
      url += (url.indexOf("?") >= 0 ? "&" : "?") + "enablejsapi=1";
    }
    if(url.indexOf("//youtube.com") >= 0){
      url = url.split("//youtube.com").join("//www.youtube.com");
    }
    $video.attr("src",url);
  })

}

LBGAnalytics.video.getVideoDetail = function(video){
  return [
    video.playerInfo.videoData.author,
    video.playerInfo.videoData.title,
    video.playerInfo.videoData.video_id,
    video.playerInfo.duration
  ].map(function(a){
    return (a || "").toString().split("/").join(" ");
  })
  .join("/")
}

LBGAnalytics.video.track = function () {

  var $ = LBGAnalytics.$;

  var $iframeYT = $("iframe[src*=www\\.youtube\\.com][src*=enablejsapi]");

  $iframeYT.each(function (i, e) {
    var $video = $(e);
    if (!$video.attr("id")) $video.attr("id", "videoanalytics" + i);
  });

  LBGAnalytics.video.videoList = $iframeYT.get().map(function(a){ return $(a).attr("id"); });

  LBGAnalytics.video.onPlayerReady = function(event){
    console.log("load",LBGAnalytics.video.getVideoDetail(event.target));
  }

  LBGAnalytics.video.onPlayerStateChange = function(event){
    if(event.data == 1) console.log("play",LBGAnalytics.video.getVideoDetail(event.target));
    if(event.data == 2) console.log("pause",LBGAnalytics.video.getVideoDetail(event.target));
    if(event.data == 0) console.log("complete",LBGAnalytics.video.getVideoDetail(event.target));
  }

  window.onYouTubeIframeAPIReady = function() {
    LBGAnalytics.video.playerList = LBGAnalytics.video.videoList.map(function(id){
      return new YT.Player(id, {
        events: {
          'onReady': LBGAnalytics.video.onPlayerReady,
          'onStateChange': LBGAnalytics.video.onPlayerStateChange
        }
      });
    });
  }

  $.getScript("https://www.youtube.com/iframe_api");

}

LBGAnalytics.video.fix();
LBGAnalytics.video.track();