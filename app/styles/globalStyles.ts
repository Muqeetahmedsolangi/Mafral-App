// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
import { spacing, borderRadius } from "./designTokens";

// Reusable global styles that don't change with theme
export const globalStyles = StyleSheet.create({
  // Layout
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexWrap: {
    flexWrap: "wrap",
  },

  // Alignment
  alignCenter: {
    alignItems: "center",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  justifyEvenly: {
    justifyContent: "space-evenly",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Margins
  m0: { margin: 0 },
  m1: { margin: spacing.xs },
  m2: { margin: spacing.sm },
  m3: { margin: spacing.md },
  m4: { margin: spacing.lg },
  m5: { margin: spacing.xl },
  m6: { margin: spacing.xxl },

  mt0: { marginTop: 0 },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mt5: { marginTop: spacing.xl },
  mt6: { marginTop: spacing.xxl },

  mb0: { marginBottom: 0 },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
  mb5: { marginBottom: spacing.xl },
  mb6: { marginBottom: spacing.xxl },

  ml0: { marginLeft: 0 },
  ml1: { marginLeft: spacing.xs },
  ml2: { marginLeft: spacing.sm },
  ml3: { marginLeft: spacing.md },
  ml4: { marginLeft: spacing.lg },
  ml5: { marginLeft: spacing.xl },
  ml6: { marginLeft: spacing.xxl },

  mr0: { marginRight: 0 },
  mr1: { marginRight: spacing.xs },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.md },
  mr4: { marginRight: spacing.lg },
  mr5: { marginRight: spacing.xl },
  mr6: { marginRight: spacing.xxl },

  mx0: { marginHorizontal: 0 },
  mx1: { marginHorizontal: spacing.xs },
  mx2: { marginHorizontal: spacing.sm },
  mx3: { marginHorizontal: spacing.md },
  mx4: { marginHorizontal: spacing.lg },
  mx5: { marginHorizontal: spacing.xl },
  mx6: { marginHorizontal: spacing.xxl },

  my0: { marginVertical: 0 },
  my1: { marginVertical: spacing.xs },
  my2: { marginVertical: spacing.sm },
  my3: { marginVertical: spacing.md },
  my4: { marginVertical: spacing.lg },
  my5: { marginVertical: spacing.xl },
  my6: { marginVertical: spacing.xxl },

  // Padding
  p0: { padding: 0 },
  p1: { padding: spacing.xs },
  p2: { padding: spacing.sm },
  p3: { padding: spacing.md },
  p4: { padding: spacing.lg },
  p5: { padding: spacing.xl },
  p6: { padding: spacing.xxl },

  pt0: { paddingTop: 0 },
  pt1: { paddingTop: spacing.xs },
  pt2: { paddingTop: spacing.sm },
  pt3: { paddingTop: spacing.md },
  pt4: { paddingTop: spacing.lg },
  pt5: { paddingTop: spacing.xl },
  pt6: { paddingTop: spacing.xxl },

  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: spacing.xs },
  pb2: { paddingBottom: spacing.sm },
  pb3: { paddingBottom: spacing.md },
  pb4: { paddingBottom: spacing.lg },
  pb5: { paddingBottom: spacing.xl },
  pb6: { paddingBottom: spacing.xxl },

  pl0: { paddingLeft: 0 },
  pl1: { paddingLeft: spacing.xs },
  pl2: { paddingLeft: spacing.sm },
  pl3: { paddingLeft: spacing.md },
  pl4: { paddingLeft: spacing.lg },
  pl5: { paddingLeft: spacing.xl },
  pl6: { paddingLeft: spacing.xxl },

  pr0: { paddingRight: 0 },
  pr1: { paddingRight: spacing.xs },
  pr2: { paddingRight: spacing.sm },
  pr3: { paddingRight: spacing.md },
  pr4: { paddingRight: spacing.lg },
  pr5: { paddingRight: spacing.xl },
  pr6: { paddingRight: spacing.xxl },

  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: spacing.xs },
  px2: { paddingHorizontal: spacing.sm },
  px3: { paddingHorizontal: spacing.md },
  px4: { paddingHorizontal: spacing.lg },
  px5: { paddingHorizontal: spacing.xl },
  px6: { paddingHorizontal: spacing.xxl },

  py0: { paddingVertical: 0 },
  py1: { paddingVertical: spacing.xs },
  py2: { paddingVertical: spacing.sm },
  py3: { paddingVertical: spacing.md },
  py4: { paddingVertical: spacing.lg },
  py5: { paddingVertical: spacing.xl },
  py6: { paddingVertical: spacing.xxl },

  // Border radius
  roundedNone: { borderRadius: 0 },
  roundedXs: { borderRadius: borderRadius.xs },
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  roundedFull: { borderRadius: borderRadius.round },

  // Width and height helpers
  w100: { width: "100%" },
  h100: { height: "100%" },
  wAuto: { width: "auto" },
  hAuto: { height: "auto" },

  // Position
  positionRelative: { position: "relative" },
  positionAbsolute: { position: "absolute" },

  // Text alignment
  textCenter: { textAlign: "center" },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" },

  // Overflow
  overflowHidden: { overflow: "hidden" },
  overflowVisible: { overflow: "visible" },
  overflowScroll: { overflow: "scroll" },

  // Z-index
  zIndex1: { zIndex: 1 },
  zIndex10: { zIndex: 10 },
  zIndex100: { zIndex: 100 },
  zIndex1000: { zIndex: 1000 },
});
