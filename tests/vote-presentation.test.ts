import { describe, expect, it } from "vitest";
import {
  getVoteType,
  getVoteValue,
  initializeVotePresentation,
  MAX_VOTE_TIME_SECONDS,
  resetVote,
  renderVotePanel,
  setVoteInProgress,
  setupVoteImages,
  setVoteType,
  setVoteValue,
  startVote,
  VOTE_DESCRIPTION_MAX_WIDTH_PIXELS,
  VOTE_IN_PROGRESS_IMAGE_PATH,
  voteInProgress,
  voteTimeExpired,
  VoteType,
  ZVOTE_HEADER_GUARD_PORTED,
} from "../src/simulation/VotePresentation";
import type {
  VoteProgressState,
  VoteInProgressImageState,
  VoteResetState,
  VoteSetupImagesState,
  VoteStartState,
  VoteTimeState,
  VoteTypeState,
  VoteValueState,
} from "../src/simulation/VotePresentation";
import { FontType } from "../src/rendering/FontEngine";

type TextImage = {
  font: FontType;
  text: string;
  width: number;
};

type VoteTextSurface = {
  w: number;
};

type VoteRenderSurface = {
  id: string;
};

function createVoteImageTarget(id: string, calls: string[]) {
  let surface: VoteTextSurface | null = null;

  return {
    get loadedSurface() {
      return surface;
    },
    loadBaseImage(image: TextImage): void {
      calls.push(`${id}:load:${image.text}`);
      surface = { w: image.width };
    },
    getBaseSurface(): VoteTextSurface | null {
      calls.push(`${id}:surface`);
      return surface;
    },
    makeAlphable(): void {
      calls.push(`${id}:alpha`);
    },
  };
}

function createVoteSetupState(calls: string[]) {
  return {
    voteType: VoteType.ChangeMap,
    descriptionImage: createVoteImageTarget("description", calls),
    forImage: createVoteImageTarget("for", calls),
    againstImage: createVoteImageTarget("against", calls),
    neededImage: createVoteImageTarget("needed", calls),
    haveImage: createVoteImageTarget("have", calls),
  } satisfies VoteSetupImagesState<TextImage, VoteTextSurface>;
}

function createVoteRenderImage(
  id: string,
  width: number | null,
  calls: string[],
) {
  return {
    surface: { id },
    getBaseSurface() {
      calls.push(`${id}:surface`);
      return width === null ? null : { w: width };
    },
    setAlpha(alpha: number) {
      calls.push(`${id}:alpha:${alpha}`);
    },
  };
}

describe("vote presentation", () => {
  it("adapts the zvote.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/VotePresentation");
    const secondImport = await import("../src/simulation/VotePresentation");

    expect(ZVOTE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZVOTE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZVOTE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the maximum vote duration", () => {
    expect(MAX_VOTE_TIME_SECONDS).toBe(30);
  });

  it("ports the vote-in-progress panel image path", () => {
    expect(VOTE_IN_PROGRESS_IMAGE_PATH).toBe(
      "assets/other/menus/vote_in_progress.png",
    );
  });

  it("ports vote types", () => {
    expect(VoteType.Pause).toBe(0);
    expect(VoteType.ChangeMap).toBe(2);
    expect(VoteType.StopBot).toBe(4);
    expect(VoteType.ChangeGameSpeed).toBe(7);
    expect(VoteType.MaxVoteTypes).toBe(8);
  });

  it("ports the maximum rendered vote description width", () => {
    expect(VOTE_DESCRIPTION_MAX_WIDTH_PIXELS).toBe(112 - 8);
  });

  it("ports the vote type getter", () => {
    const state: VoteTypeState = { voteType: VoteType.ChangeGameSpeed };

    expect(getVoteType(state)).toBe(VoteType.ChangeGameSpeed);
  });

  it("ports ZVote SetVoteType as bounded vote type assignment", () => {
    const state: VoteTypeState = { voteType: -1 };

    setVoteType(state, VoteType.ChangeMap);
    expect(state.voteType).toBe(VoteType.ChangeMap);
    expect(getVoteType(state)).toBe(VoteType.ChangeMap);

    setVoteType(state, -2);
    expect(state.voteType).toBe(-1);

    setVoteType(state, VoteType.MaxVoteTypes);
    expect(state.voteType).toBe(-1);
  });

  it("ports the vote in-progress setter", () => {
    const state: VoteProgressState = { inProgress: false };

    setVoteInProgress(state, true);
    expect(state.inProgress).toBe(true);
    expect(voteInProgress(state)).toBe(true);

    setVoteInProgress(state, false);
    expect(state.inProgress).toBe(false);
    expect(voteInProgress(state)).toBe(false);
  });

  it("ports ZVote Init as vote panel image preparation", () => {
    const state: VoteInProgressImageState = {
      voteInProgressImagePath: "",
      voteInProgressImageAlphable: false,
    };

    initializeVotePresentation(state);

    expect(state).toEqual({
      voteInProgressImagePath: VOTE_IN_PROGRESS_IMAGE_PATH,
      voteInProgressImageAlphable: true,
    });
  });

  it("ports the vote value setter", () => {
    const state: VoteValueState = { value: 0 };

    setVoteValue(state, 7);

    expect(state.value).toBe(7);
    expect(getVoteValue(state)).toBe(7);
  });

  it("ports ZVote ResetVote as clearing active vote state", () => {
    const state: VoteResetState = {
      inProgress: true,
      voteType: VoteType.ResetGame,
      value: 5,
    };

    resetVote(state);

    expect(state).toEqual({
      inProgress: false,
      voteType: -1,
      value: -1,
    });
  });

  it("ports ZVote StartVote as active vote initialization", () => {
    const state: VoteStartState = {
      inProgress: false,
      voteType: -1,
      value: -1,
      startTime: 0,
      endTime: 0,
    };

    expect(startVote(state, VoteType.ChangeMap, 7, () => 12.5)).toBe(true);
    expect(state).toEqual({
      inProgress: true,
      voteType: VoteType.ChangeMap,
      value: 7,
      startTime: 12.5,
      endTime: 12.5 + MAX_VOTE_TIME_SECONDS,
    });
  });

  it("ports ZVote StartVote as rejecting an already active vote", () => {
    const state: VoteStartState = {
      inProgress: true,
      voteType: VoteType.Pause,
      value: 1,
      startTime: 5,
      endTime: 35,
    };

    expect(startVote(state, VoteType.ResetGame, 9, () => 99)).toBe(false);
    expect(state).toEqual({
      inProgress: true,
      voteType: VoteType.Pause,
      value: 1,
      startTime: 5,
      endTime: 35,
    });
  });

  it("ports ZVote TimeExpired as current time reaching end time", () => {
    const state: VoteTimeState = { endTime: 42.5 };

    expect(voteTimeExpired(state, 42.499)).toBe(false);
    expect(voteTimeExpired(state, 42.5)).toBe(true);
    expect(voteTimeExpired(state, 43)).toBe(true);
  });

  it("ports ZVote SetupImages as yellow vote text image refresh", () => {
    const calls: string[] = [];
    const rendered: TextImage[] = [];
    const state = createVoteSetupState(calls);

    setupVoteImages(
      state,
      3,
      5,
      2,
      1,
      "Island Siege",
      (font, text) => {
        const image = { font, text, width: text.length * 4 };
        rendered.push(image);
        return image;
      },
    );

    expect(rendered).toEqual([
      { font: FontType.YellowMenu, text: "Change Map: Island Siege", width: 96 },
      { font: FontType.YellowMenu, text: "2", width: 4 },
      { font: FontType.YellowMenu, text: "1", width: 4 },
      { font: FontType.YellowMenu, text: "5", width: 4 },
      { font: FontType.YellowMenu, text: "3", width: 4 },
    ]);
    expect(calls).toEqual([
      "description:load:Change Map: Island Siege",
      "description:surface",
      "for:load:2",
      "against:load:1",
      "needed:load:5",
      "have:load:3",
      "description:alpha",
      "for:alpha",
      "against:alpha",
      "needed:alpha",
      "have:alpha",
    ]);
  });

  it("ports ZVote SetupImages as width-based description truncation", () => {
    const calls: string[] = [];
    const rendered: TextImage[] = [];
    const state = createVoteSetupState(calls);

    setupVoteImages(
      state,
      10,
      11,
      12,
      13,
      "a very long map description",
      (font, text) => {
        const image = { font, text, width: text.length * 5 };
        rendered.push(image);
        return image;
      },
    );

    expect(rendered.map((image) => image.text)).toEqual([
      "Change Map: a very long map description",
      "Change Map: a very long map descripti..",
      "Change Map: a very long map descrip..",
      "Change Map: a very long map descri..",
      "Change Map: a very long map descr..",
      "Change Map: a very long map desc..",
      "Change Map: a very long map des..",
      "Change Map: a very long map de..",
      "Change Map: a very long map d..",
      "Change Map: a very long map ..",
      "Change Map: a very long map..",
      "Change Map: a very long ma..",
      "Change Map: a very long m..",
      "Change Map: a very long ..",
      "Change Map: a very long..",
      "Change Map: a very lon..",
      "Change Map: a very lo..",
      "Change Map: a very l..",
      "Change Map: a very ..",
      "Change Map: a very..",
      "12",
      "13",
      "11",
      "10",
    ]);
    expect(state.descriptionImage.loadedSurface).toEqual({
      w: 100,
    });
  });

  it("ports ZVote SetupImages as skipping description load for invalid vote type", () => {
    const calls: string[] = [];
    const rendered: TextImage[] = [];
    const state = createVoteSetupState(calls);
    state.voteType = VoteType.MaxVoteTypes;

    setupVoteImages(state, 8, 9, 6, 7, "ignored", (font, text) => {
      const image = { font, text, width: text.length };
      rendered.push(image);
      return image;
    });

    expect(rendered.map((image) => image.text)).toEqual(["6", "7", "9", "8"]);
    expect(calls).toEqual([
      "description:surface",
      "for:load:6",
      "against:load:7",
      "needed:load:9",
      "have:load:8",
      "description:alpha",
      "for:alpha",
      "against:alpha",
      "needed:alpha",
      "have:alpha",
    ]);
  });

  it("replaces ZVote DoRender with shifted vote panel commands", () => {
    const calls: string[] = [];
    const state = {
      inProgress: true,
      voteInProgressImage: createVoteRenderImage("base", 140, calls),
      descriptionImage: createVoteRenderImage("description", 50, calls),
      haveImage: createVoteRenderImage("have", 10, calls),
      neededImage: createVoteRenderImage("needed", 10, calls),
      forImage: createVoteRenderImage("for", 10, calls),
      againstImage: createVoteRenderImage("against", 10, calls),
    };

    const commands = renderVotePanel(state, {
      getViewShiftFull: () => ({
        x: 11,
        y: 13,
        viewWidth: 320,
        viewHeight: 200,
      }),
      renderZSurface: (
        surface: VoteRenderSurface,
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) => ({ surface, x, y, renderHit, aboutCenter }),
    });

    expect(calls).toEqual([
      "base:surface",
      "base:alpha:200",
      "description:alpha:200",
      "have:alpha:200",
      "needed:alpha:200",
      "for:alpha:200",
      "against:alpha:200",
    ]);
    expect(commands).toEqual([
      {
        surface: { id: "base" },
        x: 187,
        y: 17,
        renderHit: false,
        aboutCenter: false,
      },
      {
        surface: { id: "description" },
        x: 244,
        y: 58,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: { id: "have" },
        x: 244,
        y: 70,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: { id: "needed" },
        x: 244,
        y: 81,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: { id: "for" },
        x: 209,
        y: 81,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: { id: "against" },
        x: 278,
        y: 81,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ZVote DoRender as no commands when inactive or missing base image", () => {
    const calls: string[] = [];
    const state = {
      inProgress: false,
      voteInProgressImage: createVoteRenderImage("base", 140, calls),
      descriptionImage: createVoteRenderImage("description", 50, calls),
      haveImage: createVoteRenderImage("have", 10, calls),
      neededImage: createVoteRenderImage("needed", 10, calls),
      forImage: createVoteRenderImage("for", 10, calls),
      againstImage: createVoteRenderImage("against", 10, calls),
    };
    const zmap = {
      getViewShiftFull: () => {
        throw new Error("viewport should not be read");
      },
      renderZSurface: () => {
        throw new Error("surface should not render");
      },
    };

    expect(renderVotePanel(state, zmap)).toEqual([]);

    state.inProgress = true;
    state.voteInProgressImage = createVoteRenderImage("base", null, calls);
    expect(renderVotePanel(state, zmap)).toEqual([]);
    expect(calls).toEqual(["base:surface", "base:surface"]);
  });
});
