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
    console.log("Ready");
    console.log(event);
  }

  LBGAnalytics.video.onPlayerStateChange = function(event){
    console.log("State change");
    console.log(event);
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