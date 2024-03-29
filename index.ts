import {
  Image,
  ImageSourcePropType,
  NativeModules,
  ImageResolvedAssetSource
} from "react-native";

const { ImageMarker, ImageMarker2 } = NativeModules;
const { resolveAssetSource } = Image;

export enum Position {
  topLeft = "topLeft",
  topCenter = "topCenter",
  topRight = "topRight",
  bottomLeft = "bottomLeft",
  bottomCenter = "bottomCenter",
  bottomRight = "bottomRight",
  center = "center"
}

export enum TextBackgroundType {
  stretchX = "stretchX",
  stretchY = "stretchY"
}

export enum ImageFormat {
  png = "png",
  jpg = "jpg",
  base64 = "base64"
}

export interface ShadowLayerStyle {
  dx: number;
  dy: number;
  radius: number;
  color: string;
}

export interface TextBackgroundStyle {
  paddingX: number;
  paddingY: number;
  type: TextBackgroundType;
  color: string;
}

export interface TextMarkOption {
  // image src, local image
  src: ImageSourcePropType;
  text: string;
  // if you set position you don't need to set X and Y
  X?: number;
  Y?: number;
  // eg. '#aacc22'
  color: string;
  fontName: string;
  fontSize: number;
  // scale image
  scale: number;
  // image quality
  quality: number;
  position?: Position;
  filename?: string;
  shadowStyle: ShadowLayerStyle;
  textBackgroundStyle: TextBackgroundStyle;
  saveFormat?: ImageFormat;
  maxSize?: number; // android only see #49 #42
}

export interface ImageMarkOption {
  // image src, local image
  src: ImageSourcePropType;
  markerSrc: ImageSourcePropType;
  X?: number;
  Y?: number;
  // marker scale
  markerScale: number;
  // image scale
  scale: number;
  quality: number;
  position?: Position;
  filename?: string;
  saveFormat?: ImageFormat;
  maxSize?: number; // android only see #49 #42
}

interface IImageMarkType {
  imageSource: ImageResolvedAssetSource;
  x: number;
  y: number;
}

interface ITextMarkType {
  text: string;
  x: number;
  y: number;
  color: string;
  fontName: string;
  fontSize: number;
}

export type MarkType = IImageMarkType | ITextMarkType;

export interface IMarksArrayOptions {
  source: ImageResolvedAssetSource;
  marksArray: MarkType[];
}

export default class Marker {
  static markWithMarksArray(
    source: ImageResolvedAssetSource,
    marksArray: MarkType[]
  ): Promise<string> {
    return ImageMarker2.markWithMarksArray(source, marksArray);
  }

  static markText(option: TextMarkOption): Promise<string> {
    const {
      src,
      text,
      X,
      Y,
      color,
      fontName,
      fontSize,
      shadowStyle,
      textBackgroundStyle,
      scale,
      quality,
      position,
      filename,
      saveFormat,
      maxSize = 2048
    } = option;

    if (!src) {
      throw new Error("please set image!");
    }

    let srcObj: any = resolveAssetSource(src);
    if (!srcObj) {
      srcObj = {
        uri: src,
        __packager_asset: false
      };
    }

    const mShadowStyle = shadowStyle || {};
    const mTextBackgroundStyle = textBackgroundStyle || {};

    if (!position) {
      return ImageMarker.addText(
        srcObj,
        text,
        X,
        Y,
        color,
        fontName,
        fontSize,
        mShadowStyle,
        mTextBackgroundStyle,
        scale,
        quality,
        filename,
        saveFormat,
        maxSize
      );
    } else {
      return ImageMarker.addTextByPostion(
        srcObj,
        text,
        position,
        color,
        fontName,
        fontSize,
        mShadowStyle,
        mTextBackgroundStyle,
        scale,
        quality,
        filename,
        saveFormat,
        maxSize
      );
    }
  }

  static markImage(option: ImageMarkOption): Promise<string> {
    const {
      src,
      markerSrc,
      X,
      Y,
      markerScale,
      scale,
      quality,
      position,
      filename,
      saveFormat,
      maxSize = 2048
    } = option;

    if (!src) {
      throw new Error("please set image!");
    }
    if (!markerSrc) {
      throw new Error("please set mark image!");
    }

    let srcObj: any = resolveAssetSource(src);
    if (!srcObj) {
      srcObj = {
        uri: src,
        __packager_asset: false
      };
    }

    let markerObj: any = resolveAssetSource(markerSrc);
    if (!markerObj) {
      markerObj = {
        uri: markerSrc,
        __packager_asset: false
      };
    }

    if (!position) {
      return ImageMarker.markWithImage(
        srcObj,
        markerObj,
        X,
        Y,
        scale,
        markerScale,
        quality,
        filename,
        saveFormat,
        maxSize
      );
    } else {
      return ImageMarker.markWithImageByPosition(
        srcObj,
        markerObj,
        position,
        scale,
        markerScale,
        quality,
        filename,
        saveFormat,
        maxSize
      );
    }
  }
}
