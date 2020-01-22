"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: JimmyDaddy
 * @Date: 2017-09-14 10:40:09
 * @Last Modified by: JimmyDaddy
 * @Last Modified time: 2019-10-09 16:59:00
 * @Description
 */
const react_native_1 = require("react-native");
const { ImageMarker, ImageMarker2 } = react_native_1.NativeModules;
const { resolveAssetSource } = react_native_1.Image;
var Position;
(function (Position) {
    Position["topLeft"] = "topLeft";
    Position["topCenter"] = "topCenter";
    Position["topRight"] = "topRight";
    Position["bottomLeft"] = "bottomLeft";
    Position["bottomCenter"] = "bottomCenter";
    Position["bottomRight"] = "bottomRight";
    Position["center"] = "center";
})(Position = exports.Position || (exports.Position = {}));
var TextBackgroundType;
(function (TextBackgroundType) {
    TextBackgroundType["stretchX"] = "stretchX";
    TextBackgroundType["stretchY"] = "stretchY";
})(TextBackgroundType = exports.TextBackgroundType || (exports.TextBackgroundType = {}));
var ImageFormat;
(function (ImageFormat) {
    ImageFormat["png"] = "png";
    ImageFormat["jpg"] = "jpg";
    ImageFormat["base64"] = "base64";
})(ImageFormat = exports.ImageFormat || (exports.ImageFormat = {}));
class Marker {
    static markWithMarksArray(source, marksArray) {
        return ImageMarker2.markWithMarksArray(source, marksArray);
    }
    static markText(option) {
        const { src, text, X, Y, color, fontName, fontSize, shadowStyle, textBackgroundStyle, scale, quality, position, filename, saveFormat, maxSize = 2048 } = option;
        if (!src) {
            throw new Error("please set image!");
        }
        let srcObj = resolveAssetSource(src);
        if (!srcObj) {
            srcObj = {
                uri: src,
                __packager_asset: false
            };
        }
        const mShadowStyle = shadowStyle || {};
        const mTextBackgroundStyle = textBackgroundStyle || {};
        if (!position) {
            return ImageMarker.addText(srcObj, text, X, Y, color, fontName, fontSize, mShadowStyle, mTextBackgroundStyle, scale, quality, filename, saveFormat, maxSize);
        }
        else {
            return ImageMarker.addTextByPostion(srcObj, text, position, color, fontName, fontSize, mShadowStyle, mTextBackgroundStyle, scale, quality, filename, saveFormat, maxSize);
        }
    }
    static markImage(option) {
        const { src, markerSrc, X, Y, markerScale, scale, quality, position, filename, saveFormat, maxSize = 2048 } = option;
        if (!src) {
            throw new Error("please set image!");
        }
        if (!markerSrc) {
            throw new Error("please set mark image!");
        }
        let srcObj = resolveAssetSource(src);
        if (!srcObj) {
            srcObj = {
                uri: src,
                __packager_asset: false
            };
        }
        let markerObj = resolveAssetSource(markerSrc);
        if (!markerObj) {
            markerObj = {
                uri: markerSrc,
                __packager_asset: false
            };
        }
        if (!position) {
            return ImageMarker.markWithImage(srcObj, markerObj, X, Y, scale, markerScale, quality, filename, saveFormat, maxSize);
        }
        else {
            return ImageMarker.markWithImageByPosition(srcObj, markerObj, position, scale, markerScale, quality, filename, saveFormat, maxSize);
        }
    }
}
exports.default = Marker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUtzQjtBQUV0QixNQUFNLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxHQUFHLDRCQUFhLENBQUM7QUFDcEQsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsb0JBQUssQ0FBQztBQUVyQyxJQUFZLFFBUVg7QUFSRCxXQUFZLFFBQVE7SUFDbEIsK0JBQW1CLENBQUE7SUFDbkIsbUNBQXVCLENBQUE7SUFDdkIsaUNBQXFCLENBQUE7SUFDckIscUNBQXlCLENBQUE7SUFDekIseUNBQTZCLENBQUE7SUFDN0IsdUNBQTJCLENBQUE7SUFDM0IsNkJBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVJXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBUW5CO0FBRUQsSUFBWSxrQkFHWDtBQUhELFdBQVksa0JBQWtCO0lBQzVCLDJDQUFxQixDQUFBO0lBQ3JCLDJDQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFIVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQUc3QjtBQUVELElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNyQiwwQkFBVyxDQUFBO0lBQ1gsMEJBQVcsQ0FBQTtJQUNYLGdDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQThFRCxNQUFxQixNQUFNO0lBQ3pCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FDdkIsTUFBZ0MsRUFDaEMsVUFBc0I7UUFFdEIsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQXNCO1FBQ3BDLE1BQU0sRUFDSixHQUFHLEVBQ0gsSUFBSSxFQUNKLENBQUMsRUFDRCxDQUFDLEVBQ0QsS0FB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