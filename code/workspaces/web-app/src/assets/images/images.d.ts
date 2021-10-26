// This file prevents typescript static analysis errors for imports of png and svg files.
declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.svg' {
  const value: any;
  export = value;
}
