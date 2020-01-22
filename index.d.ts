import { ImageSourcePropType, ImageResolvedAssetSource } from "react-native";
export declare enum Position {
    topLeft = "topLeft",
    topCenter = "topCenter",
    topRight = "topRight",
    bottomLeft = "bottomLeft",
    bottomCenter = "bottomCenter",
    bottomRight = "bottomRight",
    center = "center"
}
export declare enum TextBackgroundType {
    stretchX = "stretchX",
    stretchY = "stretchY"
}
export declare enum ImageFormat {
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
    src: ImageSourcePropType;
    text: string;
    X?: number;
    Y?: number;
    color: string;
    fontName: string;
    fontSize: number;
    scale: number;
    quality: number;
    position?: Position;
    filename?: string;
    shadowStyle: ShadowLayerStyle;
    textBackgroundStyle: TextBackgroundStyle;
    saveFormat?: ImageFormat;
    maxSize?: number;
}
export interface ImageMarkOption {
    src: ImageSourcePropType;
    markerSrc: ImageSourcePropType;
    X?: number;
    Y?: number;
    markerScale: number;
    scale: number;
    quality: number;
    position?: Position;
    filename?: string;
    saveFormat?: ImageFormat;
    maxSize?: number;
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
export declare type MarkType = IImageMarkType | ITextMarkType;
export interface IMarksArrayOptions {
    source: ImageResolvedAssetSource;
    marksArray: MarkType[];
}
export default class Marker {
    static markWithMarksArray(source: ImageResolvedAssetSource, marksArray: MarkType[]): Promise<string>;
    static markText(option: TextMarkOption): Promise<string>;
    static markImage(option: ImageMarkOption): Promise<string>;
}
export {};
