MobileGallery = (function() {
var _initialX;
var _isSwiping;
var _swipeDirection;
var PhotosBaseUrl = "http://chuchuva.com/mobile-gallery/";
var _photoUrls = [];

function init(params)
{
  for (var i = 0; i < 13; i++)
  {
    _photoUrls.push(PhotosBaseUrl + (i < 9 ? "0" : "") + (i + 1) + ".jpg");
  }

  var hash = location.hash.replace('#', '');
  var i = (hash > 0 && hash <= _photoUrls.length) ? hash - 1 : 0;
  $(".image-holder img").attr("src", _photoUrls[i]);

  _isSwiping = false;

  $(document).on("touchstart", ".photo", function(e) {
    e.preventDefault();

    _initialX = e.originalEvent.touches[0].clientX;
  });


  $(document).on("touchmove", ".photo", function(e) {
    e.preventDefault();

    var x = e.originalEvent.touches[0].clientX;
    if (!_isSwiping)
    {
      if (x == _initialX)
        return;
      initSwipe($(this), (x < _initialX) ? "LEFT" : "RIGHT");
    }

    $(this).css("-webkit-transform", "translate3d(" + (x - _initialX) + "px, 0, 0)");
    $(this).next().css("-webkit-transform", "translate3d(" + (x - _initialX + 
      (_swipeDirection == "LEFT" ? 1 : -1) * 340) + "px, 0, 0)");
  });

  $(document).on("touchend", ".photo", function(e) {
    e.preventDefault();
    if (_isSwiping)
      finishSwipe();
  });
}

function initSwipe(photo, direction)
{
  _isSwiping = true;
  _swipeDirection = direction;
  console.log(_initialX);

  var newPhoto = photo.clone();
  var url = photo.find("img").attr("src");
  newPhoto.find("img").attr("src", (direction == "LEFT") ? 
    getNextPhotoUrl(url) : getPrevPhotoUrl(url));
  newPhoto.insertAfter(photo);
}

function findPhoto(url)
{
  for (var i = 0; i < _photoUrls.length; i++)
  {
    if (_photoUrls[i] == url)
      return i;
  }
  return -1;
}

function getNextPhotoUrl(url)
{
  var i = findPhoto(url);
  if (i < 0)
    return _photoUrls[0];
  if (i >= _photoUrls.length)
    return null;
  return _photoUrls[i + 1];
}

function getPrevPhotoUrl(url)
{
  var i = findPhoto(url);
  if (i < 0)
    return _photoUrls[0];
  if (i == 0)
    return null;
  return _photoUrls[i - 1];
}

function finishSwipe()
{
  _isSwiping = false;
  var photoToRemove = $(".photo").first();
  photoToRemove.next().css("-webkit-transform", "");
  photoToRemove.remove();
}

return {
  "init": init
};
})();


$(function() {
  MobileGallery.init();
});
