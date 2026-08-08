/**
 * Upstream: zvote.h / zvote.cpp
 */

import { FontType } from "../rendering/FontEngine";
import type { MapSurfaceRenderCommand } from "../world/GameMap";
import { currentTime } from "./Common";

/**
 * Port of upstream `_ZVOTE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zvote.h:2
 */
export const ZVOTE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_VOTE_TIME`.
 * Role: Defines the maximum vote duration.
 * Upstream: zvote.h:10
 */
export const MAX_VOTE_TIME_SECONDS = 30;

/**
 * Port of upstream `vote_in_progress_img` asset path.
 * Role: Identifies the vote-in-progress panel image used by vote rendering.
 * Upstream: zvote.cpp:15
 */
export const VOTE_IN_PROGRESS_IMAGE_PATH =
  "assets/other/menus/vote_in_progress.png";

/**
 * Port of upstream `vote_type`.
 * Role: Identifies the kind of vote currently active in the game.
 * Upstream: zvote.h:13-18
 */
export enum VoteType {
  Pause = 0,
  Resume = 1,
  ChangeMap = 2,
  StartBot = 3,
  StopBot = 4,
  ResetGame = 5,
  ReshuffleTeams = 6,
  ChangeGameSpeed = 7,
  MaxVoteTypes = 8,
}

const VOTE_TYPE_LABELS: readonly string[] = [
  "Pause Game",
  "Resume Game",
  "Change Map",
  "Start Bot",
  "Stop Bot",
  "Reset Game",
  "Reshuffle Teams",
  "Set Game Speed",
];

/**
 * Port of upstream `vote_type`.
 * Role: Stores the kind of vote currently active.
 * Upstream: zvote.h:43
 */
export type VoteTypeState = {
  voteType: VoteType | number;
};

/**
 * Port of upstream `GetVoteType`.
 * Role: Returns the kind of vote currently active.
 * Upstream: zvote.h:41
 */
export function getVoteType(state: VoteTypeState): VoteType | number {
  return state.voteType;
}

/**
 * Port of upstream `ZVote::SetVoteType`.
 * Role: Updates the active vote kind, using -1 for out-of-range values.
 * Upstream: zvote.cpp:116-122
 */
export function setVoteType(state: VoteTypeState, voteType: number): void {
  if (voteType < 0 || voteType >= VoteType.MaxVoteTypes) {
    state.voteType = -1;
    return;
  }

  state.voteType = voteType;
}

/**
 * Port of upstream `in_progress`.
 * Role: Stores whether a vote is currently active.
 * Upstream: zvote.h:45
 */
export type VoteProgressState = {
  inProgress: boolean;
};

/**
 * Port of upstream `VoteInProgress`.
 * Role: Returns whether a vote is currently active.
 * Upstream: zvote.h:35
 */
export function voteInProgress(state: VoteProgressState): boolean {
  return state.inProgress;
}

/**
 * Port of upstream `SetVoteInProgress`.
 * Role: Updates whether a vote is currently active.
 * Upstream: zvote.h:45
 */
export function setVoteInProgress(
  state: VoteProgressState,
  inProgress: boolean,
): void {
  state.inProgress = inProgress;
}

/**
 * Port of upstream `vote_in_progress_img` initialization state.
 * Role: Holds the prepared vote-in-progress panel image metadata.
 * Upstream: zvote.cpp:13-17
 */
export type VoteInProgressImageState = {
  voteInProgressImagePath: string;
  voteInProgressImageAlphable: boolean;
};

/**
 * Port of upstream `ZVote::Init`.
 * Role: Prepares the vote-in-progress panel image for translucent rendering.
 * Upstream: zvote.cpp:13-17
 */
export function initializeVotePresentation(
  state: VoteInProgressImageState,
): void {
  state.voteInProgressImagePath = VOTE_IN_PROGRESS_IMAGE_PATH;
  state.voteInProgressImageAlphable = true;
}

/**
 * Port of upstream `value`.
 * Role: Stores the numeric payload associated with the current vote.
 * Upstream: zvote.h:44
 */
export type VoteValueState = {
  value: number;
};

/**
 * Port of upstream `GetVoteValue`.
 * Role: Returns the numeric payload associated with the current vote.
 * Upstream: zvote.h:42
 */
export function getVoteValue(state: VoteValueState): number {
  return state.value;
}

/**
 * Port of upstream `SetVoteValue`.
 * Role: Updates the numeric payload associated with the current vote.
 * Upstream: zvote.h:44
 */
export function setVoteValue(state: VoteValueState, value: number): void {
  state.value = value;
}

/**
 * Port of upstream `ZVote::ResetVote` state surface.
 * Role: Holds the active vote status, type, and numeric payload.
 * Upstream: zvote.cpp:124-129
 */
export type VoteResetState = VoteProgressState &
  VoteValueState & {
    voteType: VoteType | number;
  };

/**
 * Port of upstream `ZVote::ResetVote`.
 * Role: Clears the active vote status, vote type, and numeric payload.
 * Upstream: zvote.cpp:124-129
 */
export function resetVote(state: VoteResetState): void {
  state.inProgress = false;
  state.voteType = -1;
  state.value = -1;
}

/**
 * Port of upstream `end_time`.
 * Role: Stores the absolute time when the current vote expires.
 * Upstream: zvote.h:47
 */
export type VoteTimeState = {
  startTime?: number;
  endTime: number;
};

/**
 * Port of upstream `ZVote::StartVote` state surface.
 * Role: Holds active vote status, kind, payload, and timing fields.
 * Upstream: zvote.cpp:98-109
 */
export type VoteStartState = VoteProgressState &
  VoteValueState &
  VoteTimeState & {
    voteType: VoteType | number;
    startTime: number;
  };

/**
 * Port of upstream `ZVote::StartVote`.
 * Role: Starts a vote unless another vote is already in progress.
 * Upstream: zvote.cpp:98-109
 */
export function startVote(
  state: VoteStartState,
  voteType: VoteType | number,
  value: number,
  now: () => number = currentTime,
): boolean {
  if (state.inProgress) return false;

  state.inProgress = true;
  state.voteType = voteType;
  state.value = value;
  state.startTime = now();
  state.endTime = state.startTime + MAX_VOTE_TIME_SECONDS;

  return true;
}

/**
 * Port of upstream `ZVote::TimeExpired`.
 * Role: Reports whether the current time has reached the vote end time.
 * Upstream: zvote.cpp:111-114
 */
export function voteTimeExpired(state: VoteTimeState, now: number): boolean {
  return now >= state.endTime;
}

/**
 * Port of upstream `max_description_len`.
 * Role: Defines the maximum rendered vote description width.
 * Upstream: zvote.cpp:59
 */
export const VOTE_DESCRIPTION_MAX_WIDTH_PIXELS = 104;

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` width read used by `ZVote::SetupImages`.
 * Role: Exposes the rendered vote text width needed for description truncation.
 * Upstream: zvote.cpp:71
 */
export type VoteImageBaseSurface = {
  width?: number;
  w?: number;
};

/**
 * Port of upstream `ZVote::SetupImages` state surface.
 * Role: Holds the text image targets refreshed for an active vote panel.
 * Upstream: zvote.cpp:57-96
 */
export type VoteSetupImagesState<TImage, TSurface extends VoteImageBaseSurface> =
  VoteTypeState & {
    descriptionImage: VoteImageTarget<TImage, TSurface>;
    forImage: VoteImageTarget<TImage, TSurface>;
    againstImage: VoteImageTarget<TImage, TSurface>;
    neededImage: VoteImageTarget<TImage, TSurface>;
    haveImage: VoteImageTarget<TImage, TSurface>;
  };

/**
 * Port of upstream `ZSDL_Surface` text image target used by `ZVote::SetupImages`.
 * Role: Receives rendered text images and marks them ready for alpha blending.
 * Upstream: zvote.cpp:68-95
 */
export type VoteImageTarget<TImage, TSurface extends VoteImageBaseSurface> = {
  loadBaseImage(image: TImage): void;
  getBaseSurface(): TSurface | null;
  makeAlphable(): void;
};

/**
 * Port of upstream `ZFontEngine::GetFont(YELLOW_MENU_FONT).Render`.
 * Role: Renders vote panel text with the yellow menu font.
 * Upstream: zvote.cpp:68-89
 */
export type VoteTextRenderer<TImage> = (
  font: FontType,
  text: string,
) => TImage;

function getVoteImageWidth(surface: VoteImageBaseSurface): number {
  return surface.w ?? surface.width ?? 0;
}

function loadVoteTextImage<TImage, TSurface extends VoteImageBaseSurface>(
  target: VoteImageTarget<TImage, TSurface>,
  renderText: VoteTextRenderer<TImage>,
  text: string,
): void {
  target.loadBaseImage(renderText(FontType.YellowMenu, text));
}

/**
 * Port of upstream `ZVote::SetupImages`.
 * Role: Refreshes vote panel text images and truncates the description by rendered width.
 * Upstream: zvote.cpp:57-96
 */
export function setupVoteImages<
  TImage,
  TSurface extends VoteImageBaseSurface,
>(
  state: VoteSetupImagesState<TImage, TSurface>,
  have: number,
  needed: number,
  forVotes: number,
  againstVotes: number,
  appendDescription: string,
  renderText: VoteTextRenderer<TImage>,
): void {
  let description = VOTE_TYPE_LABELS[state.voteType] ?? "";

  if (appendDescription.length > 0) {
    description += `: ${appendDescription}`;
  }

  if (state.voteType >= 0 && state.voteType < VoteType.MaxVoteTypes) {
    loadVoteTextImage(state.descriptionImage, renderText, description);
  }

  let descriptionSurface = state.descriptionImage.getBaseSurface();
  while (
    description.length >= 3 &&
    descriptionSurface &&
    getVoteImageWidth(descriptionSurface) > VOTE_DESCRIPTION_MAX_WIDTH_PIXELS
  ) {
    description = `${description.substring(0, description.length - 3)}..`;
    loadVoteTextImage(state.descriptionImage, renderText, description);
    descriptionSurface = state.descriptionImage.getBaseSurface();
  }

  loadVoteTextImage(state.forImage, renderText, String(forVotes));
  loadVoteTextImage(state.againstImage, renderText, String(againstVotes));
  loadVoteTextImage(state.neededImage, renderText, String(needed));
  loadVoteTextImage(state.haveImage, renderText, String(have));

  state.descriptionImage.makeAlphable();
  state.forImage.makeAlphable();
  state.againstImage.makeAlphable();
  state.neededImage.makeAlphable();
  state.haveImage.makeAlphable();
}

/**
 * Replacement for upstream `ZVote::DoRender` image dependency.
 * Role: Exposes a vote panel surface and its base image dimensions for render command generation.
 * Upstream: zvote.cpp:21-53
 */
export type VoteRenderImage<TSurface> = {
  getBaseSurface(): VoteImageBaseSurface | null;
  setAlpha(alpha: number): void;
  surface: TSurface;
};

/**
 * Replacement state for upstream `ZVote::DoRender`.
 * Role: Holds active vote status and the vote panel surfaces rendered in upstream order.
 * Upstream: zvote.cpp:21-53
 */
export type VoteRenderState<TSurface> = VoteProgressState & {
  voteInProgressImage: VoteRenderImage<TSurface>;
  descriptionImage: VoteRenderImage<TSurface>;
  haveImage: VoteRenderImage<TSurface>;
  neededImage: VoteRenderImage<TSurface>;
  forImage: VoteRenderImage<TSurface>;
  againstImage: VoteRenderImage<TSurface>;
};

/**
 * Port of upstream `ZMap::GetViewShiftFull` and `RenderZSurface` dependencies used by `ZVote::DoRender`.
 * Role: Provides viewport placement data and converts vote panel surfaces to render commands.
 * Upstream: zvote.cpp:27, zvote.cpp:45-53
 */
export type VoteRenderMap<TSurface> = {
  getViewShiftFull(): {
    x: number;
    y: number;
    viewWidth: number;
    viewHeight: number;
  };
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface>;
};

const VOTE_RENDER_ALPHA = 200;

/**
 * Replacement for upstream `ZVote::DoRender`.
 * Role: Builds shifted vote panel render commands and applies translucent surface alpha.
 * Upstream: zvote.cpp:19-55
 */
export function renderVotePanel<TSurface>(
  state: VoteRenderState<TSurface>,
  zmap: VoteRenderMap<TSurface>,
): Array<MapSurfaceRenderCommand<TSurface>> {
  const baseSurface = state.voteInProgressImage.getBaseSurface();
  if (!state.inProgress || !baseSurface) return [];

  const view = zmap.getViewShiftFull();
  const x =
    view.viewWidth - getVoteImageWidth(baseSurface) - 4 + view.x;
  const y = 4 + view.y;

  state.voteInProgressImage.setAlpha(VOTE_RENDER_ALPHA);
  state.descriptionImage.setAlpha(VOTE_RENDER_ALPHA);
  state.haveImage.setAlpha(VOTE_RENDER_ALPHA);
  state.neededImage.setAlpha(VOTE_RENDER_ALPHA);
  state.forImage.setAlpha(VOTE_RENDER_ALPHA);
  state.againstImage.setAlpha(VOTE_RENDER_ALPHA);

  return [
    zmap.renderZSurface(state.voteInProgressImage.surface, x, y, false, false),
    zmap.renderZSurface(state.descriptionImage.surface, x + 57, y + 41, false, true),
    zmap.renderZSurface(state.haveImage.surface, x + 57, y + 53, false, true),
    zmap.renderZSurface(state.neededImage.surface, x + 57, y + 64, false, true),
    zmap.renderZSurface(state.forImage.surface, x + 22, y + 64, false, true),
    zmap.renderZSurface(state.againstImage.surface, x + 91, y + 64, false, true),
  ];
}
