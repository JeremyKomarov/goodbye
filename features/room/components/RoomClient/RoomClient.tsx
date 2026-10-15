"use client";

import styles from "./RoomClient.module.scss";
import { AnimatePresence, MotionConfig } from "motion/react";
import { GamesHub } from "@/features/games/components/GamesHub/GamesHub";
import { PaneHeader, SideNav, TabBar } from "@/features/room/components/RoomNavigation/RoomNavigation";
import { RoomHeader } from "@/features/room/components/RoomHeader/RoomHeader";
import { EmojiRain } from "@/features/room/components/EmojiRain/EmojiRain";
import { FarewellWall } from "@/features/room/components/FarewellWall/FarewellWall";
import { Finale } from "@/features/room/components/Finale/Finale";
import { Hero } from "@/features/room/components/Hero/Hero";
import { JoinGate } from "@/features/room/components/JoinGate/JoinGate";
import { Leaderboard } from "@/features/room/components/Leaderboard/Leaderboard";
import { MeSheet } from "@/features/room/components/MeSheet/MeSheet";
import { Scroll, StatusStack } from "@/features/room/components/RoomLayout/RoomLayout";
import { VoteHeatmap } from "@/features/room/components/VoteHeatmap/VoteHeatmap";
import { Welcome } from "@/features/room/components/Welcome/Welcome";
import { leftLine } from "@/core/room-view";
import type { Room } from "@/core/types";
import { useRoomScreen } from "./useRoomScreen";

export function RoomClient({ initialRoom }: { initialRoom: Room }) {
  const { api, room, me, messages, now, tab, game, setGame, meOpen, setMeOpen,
    voteList, tally, leader, drawn, mySlot, adminHref, isHost, typers, unread,
    changeTab, summaries, paneSubtitle, showFinale, closeFinale, heroProps,
    openMe, myUserId, party, gamesClosed } = useRoomScreen(initialRoom);
  return (
    <MotionConfig reducedMotion="user">
      {/* App shell: exactly one viewport tall; only the content area scrolls.
          Short desktop windows drop the outer frame to keep every pixel. */}
      <div className={styles.view5}>
        <div className={styles.view6}>
          {/* Desktop sidebar */}
          <aside className={styles.view7}>
            <RoomHeader
              room={room}
              now={now}
              me={me}
              onMe={openMe}
              online={api.online}
              typers={typers}
              showClock={false}
              adminHref={adminHref}
              onParty={party}
            />
            <StatusStack className={styles.view8}>
              <Hero {...heroProps} />
            </StatusStack>
            {/* The sections stay pinned, so they never scroll out of reach. */}
            <SideNav
              tab={tab}
              onChange={changeTab}
              unread={unread}
              summaries={summaries}
              className={styles.view9}
            />
          </aside>

          {/* Main column (the whole app on phones) */}
          <section className={styles.view10}>
            <div className={styles.view11}>
              <RoomHeader
                room={room}
                now={now}
                me={me}
                onMe={openMe}
                online={api.online}
                typers={typers}
                showClock={tab !== "vote"}
                adminHref={adminHref}
                onParty={party}
              />
            </div>
            <PaneHeader
              tab={tab}
              subtitle={paneSubtitle[tab].text}
              highlight={paneSubtitle[tab].highlight}
            />

            <main className={styles.view12}>
              {/* Countdown on top and the grid filling the rest; side by side on landscape phones. */}
              {tab === "vote" && (
                <div className={styles.view13}>
                  {/* Stories and countdown take whatever room the picker leaves. */}
                  <StatusStack className={styles.view14}>
                    <Hero {...heroProps} compact />
                  </StatusStack>
                  <VoteHeatmap
                    room={room}
                    now={now}
                    tally={tally}
                    players={api.players}
                    myUserId={myUserId}
                    mySlot={mySlot}
                    onVote={api.vote}
                    canVote={!isHost}
                    className={styles.view15}
                  />
                </div>
              )}
              {tab === "games" && (
                <GamesHub
                  game={game}
                  onGameChange={setGame}
                  leaderboard={api.leaderboard}
                  myUserId={myUserId}
                  onScore={api.submitScore}
                  closed={
                    gamesClosed
                      ? `${leftLine(room)}, אז השיאים נשארים כמו שהם. מי שבראש, נשאר שם 👑`
                      : null
                  }
                  onBoard={() => changeTab("board")}
                />
              )}
              {tab === "wall" && (
                <FarewellWall
                  room={room}
                  messages={messages}
                  myUserId={myUserId}
                  hosts={api.hosts}
                  reactions={api.reactions}
                  typers={typers}
                  onSend={api.postMessage}
                  onReact={api.react}
                  onTyping={api.setTyping}
                  onEmoji={api.sendEmoji}
                />
              )}
              {tab === "board" && (
                <Scroll key="board" className={styles.view16}>
                  <Leaderboard
                    room={room}
                    tally={tally}
                    leaderboard={api.leaderboard}
                    myUserId={myUserId}
                    onPlay={
                      gamesClosed
                        ? undefined
                        : (id) => {
                            changeTab("games");
                            setGame(id);
                          }
                    }
                  />
                </Scroll>
              )}
            </main>

            <TabBar tab={tab} onChange={changeTab} unread={unread} />
          </section>
        </div>
      </div>

      <EmojiRain subscribe={api.onRain} />
      {/* Keyed by user, so whoever comes in after "not you?" gets their own hello. */}
      <Welcome key={me?.userId} me={me} returning={api.returning} />
      {me && (
        <MeSheet
          me={me}
          open={meOpen}
          onClose={() => setMeOpen(false)}
          onRename={api.rename}
          onSwitch={api.switchUser}
          onLoginCode={api.loginCode}
        />
      )}

      <AnimatePresence>
        {showFinale && (
          <Finale
            room={room}
            drawn={drawn}
            leadingMs={leader && leader.tied.length === 1 ? leader.ms : null}
            voterCount={voteList.length}
            messages={messages}
            reactions={api.reactions}
            leaderboard={api.leaderboard}
            onClose={closeFinale}
          />
        )}
      </AnimatePresence>

      {/* Covers the room until we know who you are, so newcomers see the name prompt first. */}
      <AnimatePresence>
        {api.authState !== "ready" && (
          <JoinGate
            key="gate"
            room={room}
            checking={api.authState === "loading"}
            voterCount={voteList.length}
            onJoin={api.join}
            onSignInAs={api.signInAs}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
