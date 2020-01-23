package com.jimmydaddy.imagemarker

import android.graphics.*
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import android.util.Base64
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.DataSource
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber
import com.facebook.imagepipeline.request.ImageRequest
import com.facebook.react.bridge.*
import com.facebook.react.views.text.ReactFontManager
import java.util.*
import java.util.concurrent.Executors

import com.facebook.drawee.backends.pipeline.Fresco.getImagePipeline
import com.facebook.imagepipeline.image.CloseableImage
import com.jimmydaddy.imagemarker.Utils.transRGBColor
import java.io.ByteArrayOutputStream
import android.graphics.BitmapFactory


class ImageMarker2Manager(context: ReactApplicationContext): ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "ImageMarker2"
    }

    private inner class ImageMarkObject(map: HashMap<String, Any>) {
        val imageSource = map["imageSource"] as? HashMap<String, Any>?
        val  x = map["x"] as? Double?
        val y = map["y"] as? Double?
    }

    private inner class TextMarkObject(map: HashMap<String, Any>) {
        internal val text = map["text"] as? String?
        internal val x = map["x"] as? Double?
        internal val y = map["y"] as? Double?
        internal val color = map["color"] as? String?
        internal val fontName = map["fontName"] as? String?
        internal val fontSize = map["fontSize"] as? Double?
    }

    private fun isFrescoImg(uri: String?): Boolean {
        return uri != null && (uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("file://") || uri.startsWith("data:") && uri.contains("base64") && (uri.contains("img") || uri.contains("image")))
    }

    private fun getDrawableResourceByName(name: String): Int {
        return this.reactApplicationContext.resources.getIdentifier(
                name,
                "drawable",
                this.reactApplicationContext.packageName)
    }

    @ReactMethod
    fun markWithMarksArray(
            source: ReadableMap,
            marksArray: ReadableArray,
            promise: Promise
    ) {
        try {
            val marksArrayList = marksArray.toArrayList() as ArrayList<HashMap<String, Any>>
            val uri = source.getString("uri")
            val paint = Paint()
            paint.isDither = true

            val executor = Executors.newSingleThreadExecutor()

            if (isFrescoImg(uri)) {
                val imageRequest = ImageRequest.fromUri(uri)
                val dataSource = getImagePipeline().fetchDecodedImage(imageRequest, null)
                dataSource.subscribe(object : BaseBitmapDataSubscriber() {
                    public override fun onNewResultImpl(background: Bitmap?) {
                        if (background == null) {
                            promise.reject("marker error", "Can't retrieve the file from the src: $uri")
                            return
                        }
                        val height = background.height
                        val width = background.width
                        val destinationBitmap = Utils.getBlankBitmap(width, height)
                        val canvas = Canvas(destinationBitmap)
                        canvas.density = Bitmap.DENSITY_NONE
                        canvas.drawBitmap(background, 0f, 0f, paint)
                        drawOnCanvas(destinationBitmap, canvas, paint, marksArrayList, 0, promise)
                    }

                    override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
                        promise.reject("marker error", "Can't request the image from the uri: $uri", dataSource.failureCause)
                    }
                }, executor)
            } else {
                executor.execute {
                    val resourceId = getDrawableResourceByName(uri ?: "")
                    if (resourceId == 0) {
                        promise.reject("error", "Can't get resource by the path: $uri")
                        return@execute
                    }
                    val resources = this.reactApplicationContext.resources
                    val options = BitmapFactory.Options()
                    options.inScaled = false
                    val background = BitmapFactory.decodeResource(resources, resourceId, options)
                    val height = background.height
                    val width = background.width
                    val destinationBitmap = Utils.getBlankBitmap(width, height)
                    val canvas = Canvas(destinationBitmap)
                    canvas.density = Bitmap.DENSITY_NONE
                    canvas.drawBitmap(background, 0f, 0f, paint)
                    drawOnCanvas(destinationBitmap, canvas, paint, marksArrayList, 0, promise)
                }
            }
        } catch (e: Exception) {
            promise.reject("marker error", e.message)
        }

    }

    private fun drawOnCanvas(
            destinationBitmap: Bitmap,
            canvas: Canvas,
            paint: Paint,
            marksArray: ArrayList<HashMap<String, Any>>,
            index: Int,
            promise: Promise
    ) {
        if (index >= marksArray.size) {
            getBase64StringFromBitmap(destinationBitmap, promise)
            return
        }
        val map = marksArray[index]
        val imageMarkObject = ImageMarkObject(map)
        val textMarkObject = TextMarkObject(map)
        if (imageMarkObject?.imageSource != null) {
            drawImageOnCanvas(destinationBitmap, canvas, paint, marksArray, index, imageMarkObject, promise)
            return

        }
        if (textMarkObject?.text != null) {
            drawTextOnCanvas(destinationBitmap, canvas, paint, marksArray, index, textMarkObject, promise)
            return
        }
        drawOnCanvas(destinationBitmap, canvas, paint, marksArray, index + 1, promise)
    }

    private fun drawImageOnCanvas(
            destinationBitmap: Bitmap,
            canvas: Canvas,
            paint: Paint,
            marksArray: ArrayList<HashMap<String, Any>>,
            index: Int,
            imageMark: ImageMarkObject,
            promise: Promise
    ) {
        val uri = imageMark.imageSource?.get("uri") as? String?
        val x = imageMark.x ?: 0.0
        val y = imageMark.y ?: 0.0
        val executor = Executors.newSingleThreadExecutor()
        if (isFrescoImg(uri)) {
            val imageRequest = ImageRequest.fromUri(uri)
            val dataSource = getImagePipeline().fetchDecodedImage(imageRequest, null)
            dataSource.subscribe(object : BaseBitmapDataSubscriber() {
                public override fun onNewResultImpl(bitmap: Bitmap?) {
                    if (bitmap == null) {
                        promise.reject("marker error", "Can't retrieve the file from the src: $uri")
                    }
                    canvas.drawBitmap(bitmap, x.toFloat(), y.toFloat(), paint)
                    drawOnCanvas(destinationBitmap, canvas, paint, marksArray, index + 1, promise)

                }

                override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
                    promise.reject("error", "Can't request the image from the uri: $uri", dataSource.failureCause)
                    drawOnCanvas(destinationBitmap, canvas, paint, marksArray, index + 1, promise)
                }
            }, executor)
        } else {
            executor.execute {
                val resourceId = getDrawableResourceByName(uri ?: "")
                if (resourceId == 0) {
                    promise.reject("error", "Can't get resource by the path: $uri")
                } else {

                    val resources = this.reactApplicationContext.resources
                    val options = BitmapFactory.Options()
                    options.inScaled = false
                    val bitmap = BitmapFactory.decodeResource(resources, resourceId, options)
                    canvas.drawBitmap(bitmap, x.toFloat(), y.toFloat(), paint)
                    drawOnCanvas(destinationBitmap, canvas, paint, marksArray, index + 1, promise)

                }
            }

        }
    }

    private fun drawTextOnCanvas(
            destinationBitmap: Bitmap,
            canvas: Canvas,
            paint: Paint,
            marksArray: ArrayList<HashMap<String, Any>>,
            index: Int,
            textMark: TextMarkObject,
            promise: Promise
    ) {
        val text = textMark.text
        val x = textMark.x ?: 0.0
        val y = textMark.y ?: 0.0
        val color = textMark.color
        val fontName = textMark.fontName
        val fontSize = textMark.fontSize
        val textPaint = TextPaint(Paint.ANTI_ALIAS_FLAG or Paint.DEV_KERN_TEXT_FLAG)
        textPaint.isAntiAlias = true
        try {
            textPaint.typeface = ReactFontManager.getInstance().getTypeface(fontName, Typeface.NORMAL, this.reactApplicationContext.assets)
        } catch (e: Exception) {
            textPaint.typeface = Typeface.DEFAULT
        }

        textPaint.textSize = (fontSize ?: 12.0).toFloat()
        textPaint.color = Color.parseColor(transRGBColor(color))

        val textLayout = StaticLayout(text, textPaint, canvas.width, Layout.Alignment.ALIGN_NORMAL, 1.0f, 0.0f, false)
        canvas.save()
        canvas.translate(x.toFloat(), y.toFloat())
        textLayout.draw(canvas)
        canvas.restore()
        drawOnCanvas(destinationBitmap, canvas, paint, marksArray, index + 1, promise)
    }

    private fun getBase64StringFromBitmap(
            bitmap: Bitmap,
            promise: Promise
    ) {
        val base64Stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, base64Stream)
        val bitmapBytes = base64Stream.toByteArray()
        val result = Base64.encodeToString(bitmapBytes, Base64.DEFAULT)
        promise.resolve("data:image/png;base64,$result")
    }
}