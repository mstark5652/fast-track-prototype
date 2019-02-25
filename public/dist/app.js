(function() {

    var video = document.getElementById("video")
    var canvas = document.getElementById("canvas")
    var canvasRect = canvas.getBoundingClientRect()
    var context = canvas.getContext("2d")

    var templateImageData;
    var videoHeight = 295;
    var videoWidth = 393;
    var boxLeft = 403;
    var MAX_MATCH_POINTS = 60;

    var tracker = new FastTracker();

    tracker.on("track", function(event) {

        event.data.sort(function(a, b) {
            return b.confidence - a.confidence;
        });

        // Re-draws template on canvas.
        context.putImageData(templateImageData, boxLeft, 0);

        // Plots lines connecting matches.
        for (var i = 0; i < Math.min(MAX_MATCH_POINTS, event.data.length); i++) {
            var frame = event.data[i].keypoint2;
            foundPoint(frame[0], frame[1]);

            context.beginPath();
            context.strokeStyle = 'magenta';
            context.moveTo(frame[0], frame[1]);
            context.lineTo(frame[0] + 3, frame[1] + 3);
            context.stroke();
            
        }

    });

    function foundPoint (x, y) {
        // x,y match found

    }

    var trackerTask = tracking.track(video, tracker, { camera: true });
    // Waits for the user to accept the camera.
    trackerTask.stop();

    // Sync video ============================================================
    function requestFrame() {
        window.requestAnimationFrame(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                try {
                    context.drawImage(video, 0, 0, videoWidth, videoHeight);
                } catch (err) { }
            }
            requestFrame();
        });
    }
    requestFrame();



    setTemplateImageData(window.templateImagePath || "models/mr9_model.png");
    

    function setTemplateImageData (imagePath) {
        if (typeof imagePath === undefined || imagePath === null) {
            return
        }
        let img = document.createElement("img")
        img.setAttribute("crossOrigin", "anonymous")

        img.onload = function (e) {
            let image = e.target

            let canvas = document.createElement("canvas")
            canvas.width = image.width
            canvas.height = image.height
            let ctx = canvas.getContext("2d")
            ctx.drawImage(image, 0, 0)

            templateWidth = canvas.width
            templateHeight = canvas.height
            templateImageData = ctx.getImageData(0, 0, templateWidth, templateHeight)
            
            tracker.setTemplate(templateImageData.data, templateWidth, templateHeight)
            trackerTask.run()
        }

        img.src = imagePath
    }


})();