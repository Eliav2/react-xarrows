import { Dir, Vector } from "./vector";
import { RelativeSize } from "shared/types";
import { IDir } from "../types";

export interface Rule<Context, Result> {
  instruction: (context: Context) => Result;
  condition: (context: Context) => boolean;
}

export class RuleDirector<Input, Context, Result> {
  rules: Rule<Context, Result>[];
  context: Context | null;

  constructor(rules: Rule<Context, Result>[]) {
    this.rules = rules;
    this.context = null;
  }

  initContext(input: Input): void {
    throw new Error("Method not implemented.");
  }

  resolve(input: Input): Result | null {
    this.initContext(input);
    for (const rule of this.rules) {
      if (rule.condition(this.context!)) return rule.instruction(this.context!);
    }
    // fallback option: last rule. (if no rules at all, fallback to forward)
    return this.rules.at(-1)?.instruction(this.context!) ?? null;
  }
}

// export class AnchorsDirector implements RuleDirector<EdgeVectors, AnchorChooserContext, EdgeDirs> {
export class AnchorsDirector extends RuleDirector<EdgeVectors, AnchorChooserContext, EdgeDirs> {
  initContext(input: EdgeVectors) {
    const { start, end } = input;
    const forward = end.sub(start).dir();
    const startDirOnForward = start.chooseDir(forward) ?? forward;
    let endDirOnForward = end.chooseDir(forward) ?? forward;
    this.context = {
      start,
      end,
      startDirOnForward,
      endDirOnForward,
      startDir: start.dir(),
      endDir: end.dir(),
      forward,
    };
  }

  resolve(input: EdgeVectors) {
    // call the default implementation with defaults for startDir and endDir
    return super.resolve(input) ?? { startDir: this.context!.forward, endDir: this.context!.forward };
  }
}

type AnchorChooserContext = EdgeVectors & EdgeDirs & { startDirOnForward: Dir; endDirOnForward: Dir; forward: Dir };

const defaultAnchorChooser = new AnchorsDirector([
  // prefer z turns
  {
    condition: (c) => c.startDir.canZTurnTo(c.endDir),
    instruction: (c) => ({ startDir: c.startDirOnForward, endDir: c.endDirOnForward }),
  },
  // r turn
  {
    condition: (c) => c.startDir.canRTurnTo(c.endDir),
    instruction: (c) => ({ startDir: c.startDirOnForward, endDir: c.endDirOnForward }),
  },
  // fallback first allowed dir,or forward dir if no dir allowed
  {
    condition: (c) => true,
    instruction: (c) => ({
      startDir: c.start.trailingDir?.[0] ?? c.forward,
      endDir: c.end.trailingDir?.[0] ?? c.forward,
    }),
  },
]);

/**
 * This class is used to parse the path roles string and determine the path behavior
 *
 * Example:
 *  const pathDirector = new PathDirector([
 *    [()=>true,(vectors)=>{return [vectors.up,vectors.down]}],
 *    [()=>true,"S 20sd 100%-40f E-20ed E"]
 *   ]);
 */
class PathDirector extends RuleDirector<EdgeVectors, PathDirectorContext, Vector[]> {
  axes: Dir[];
  anchorsDirector: AnchorsDirector;

  constructor(
    // roles: PathRoleInitiator[], anchorsDirsChooser?: AnchorsDirsChooser, options: { axes?: IDir[] } = { axes: [xDir, yDir] })
    args: { rules: Rule<PathDirectorContext, Vector[]>[]; options?: { axes?: IDir[]; anchorsDirector?: AnchorsDirector } }
  ) {
    super(args.rules);
    const { options = {} } = args;
    this.anchorsDirector = options.anchorsDirector ?? defaultAnchorChooser;
    options.axes ??= [xDir, yDir];
    this.axes = options.axes.map((axis) => new Dir(axis.x, axis.y));
  }

  initContext(context: { start: Vector; end: Vector }) {
    const { start, end } = context;
    const forward = end.sub(start).dir();
    const sidewards = forward.rotate(90);
    const major = forward.biggestProjection(this.axes);
    const minor = forward.smallestProjection(this.axes);
    const { startDir, endDir } = this.anchorsDirector.resolve({ start, end });

    this.context = {
      Start: start,
      S: start,
      End: end,
      E: end,

      x: xDir,
      y: yDir,
      forward,
      f: forward,
      forwardPerpendicular: sidewards,
      fp: sidewards,
      major,
      j: major,
      minor,
      n: minor,

      startDir,
      sd: startDir,
      startDirPerpendicular: startDir.rotate(90),
      sdp: startDir.rotate(90),
      endDir,
      ed: endDir,
      endDirPerpendicular: endDir.rotate(90),
      edp: endDir.rotate(90),
    };
  }

  // private parseStringInstruction(instruction: string): PathRoleFuncInstructions {
  //   // todo
  //   return undefined as any;
  // }
}

const xDir = new Dir(1, 0);
const yDir = new Dir(0, 1);

const defaultPathDirector = new PathDirector({
  rules: [
    {
      condition: () => true,
      instruction: (context) => [context.S, context.E],
    },
  ],
  options: {
    axes: [xDir, yDir],
    anchorsDirector: defaultAnchorChooser,
  },
});

// vectors
type PathCommandVectors =
  | "Start" //
  | "End"
  | "S"
  | "E";

// these directions are fixed and determined by the start and end points
type PathCommandDirections =
  | "x"
  | "y"
  | "forward"
  | "f"
  | "forwardPerpendicular" // sidewards clockwise from forward
  | "fp" // shorthand for forwardPerpendicular
  | "major"
  | "j"
  | "minor"
  | "n";
// these directions are determined dynamically by the path and chosen by the pathRoles
type PathCommandDirectionsDynamic =
  | "startDir" //
  | "sd"
  | "startDirPerpendicular"
  | "sdp"
  | "endDir"
  | "ed"
  | "endDirPerpendicular"
  | "edp";

type PathCommand = PathCommandVectors | PathCommandDirections | PathCommandDirectionsDynamic;

export type PathDirectorContext = {
  // [key in PathCommand]: Vector;
  x: Dir;
  y: Dir;
  forward: Dir;
  f: Dir;
  forwardPerpendicular: Dir;
  fp: Dir;
  major: Dir;
  j: Dir;
  minor: Dir;
  n: Dir;
  startDir: Dir;
  sd: Dir;
  startDirPerpendicular: Dir;
  sdp: Dir;
  endDir: Dir;
  ed: Dir;
  endDirPerpendicular: Dir;
  edp: Dir;
  Start: Vector;
  S: Vector;
  End: Vector;
  E: Vector;
};

type PathRole = {
  instruction: (vectors: PathDirectorContext) => boolean;
  condition?: PathRoleCondition;
};

type PathRoleInitiator = {
  instructions: PathRoleInstruction;
  condition?: PathRoleCondition;
};

type PathRoleCondition = (vectors: PathDirectorContext) => boolean;
type PathRoleInstruction = PathRoleFuncInstructions | PathRoleStringInstructions;
type PathRoleFuncInstructions = (vectors: PathDirectorContext) => Vector[];
type PathRoleStringInstructions = string;
type PathRoleStringInstruction = `${Exclude<RelativeSize, number>}${PathCommand}`;

type EdgeVectors = { start: Vector; end: Vector };
type EdgeDirs = { startDir: Dir; endDir: Dir };
type AnchorRole = {
  instructions: (input: EdgeVectors) => EdgeDirs;
  condition: (input: EdgeVectors) => boolean;
};

export default PathDirector;
