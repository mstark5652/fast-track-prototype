

var FastTracker = function() {
    FastTracker.base(this, "constructor");
};

tracking.inherits(FastTracker, tracking.Tracker);

FastTracker.prototype.templateDescriptors_ = null;
FastTracker.prototype.templateKeypoints_ = null;
FastTracker.prototype.fastThreshold = 50;
FastTracker.prototype.blur = 3;

FastTracker.prototype.setTemplate = function(pixels, width, height) {
    var blur = tracking.Image.blur(pixels, width, height, 3);
    var grayscale = tracking.Image.grayscale(blur, width, height);
    this.templateKeypoints_ = tracking.Fast.findCorners(grayscale, width, height);
    this.templateDescriptors_ = tracking.Brief.getDescriptors(grayscale, width, this.templateKeypoints_);
};

FastTracker.prototype.track = function (pixels, width, height) {
    var blur = tracking.Image.blur(pixels, width, height, this.blur);
    var grayscale = tracking.Image.grayscale(blur, width, height);
    var keypoints = tracking.Fast.findCorners(grayscale, width, height, this.fastThreshold);
    var descriptors = tracking.Brief.getDescriptors(grayscale, width, keypoints);
    this.emit('track', {
        data: tracking.Brief.reciprocalMatch(this.templateKeypoints_, this.templateDescriptors_, keypoints, descriptors)
    });
};

window.FastTracker = FastTracker;
