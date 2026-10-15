"use client";

import styles from "./MessageBubble.module.scss";
import { AnimatePresence, motion } from "motion/react";
import { Ticks } from "@/components/ui/Ticks/Ticks";
import { nameColor } from "@/core/colors";
import { formatHour, g } from "@/core/hebrew";
import { type ReactionEmoji, type ReactionMap, REACTIONS, reactionCounts } from "@/core/reactions";
import type { Room, WallMessage } from "@/core/types";

type Props = { message: WallMessage; previous?: WallMessage; room: Room; myUserId: string | null; hosts: string[]; reactions: ReactionMap; picking: number | null; onPicking: (id: number | null) => void; onReact: (messageId: number, emoji: ReactionEmoji | null) => void };

export function MessageBubble({ message: m, previous: prev, room, myUserId, hosts, reactions, picking, onPicking: setPicking, onReact }: Props) {
  const tz = room.timezone;
                const mine = m.user_id === myUserId;
                const grouped = prev && prev.user_id === m.user_id;
                const chips = reactionCounts(reactions[m.id]);
                const myReaction = myUserId
                  ? reactions[m.id]?.[myUserId]
                  : undefined;
                return (
                  <motion.div
                    key={m.id}
                    layout="position"
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 24, stiffness: 320 }}
                    className={[styles.view7, mine ? styles.view8 : styles.view9, "", grouped ? "" : styles.view10, "", chips.length ? styles.view11 : "", ""].filter(Boolean).join(" ")}
                  >
                    <div
                      data-reactions={m.id}
                      className={[styles.view12, mine ? styles.view13 : styles.view14, ""].filter(Boolean).join(" ")}
                    >
                      {/* Tap a bubble to react, like a long-press in WhatsApp. */}
                      <AnimatePresence>
                        {picking === m.id && (
                          <motion.div
                            role="menu"
                            aria-label="תגובה להודעה"
                            initial={{ opacity: 0, y: 6, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={[styles.view15, mine ? styles.view16 : styles.view17, ""].filter(Boolean).join(" ")}
                          >
                            {REACTIONS.map((emoji) => (
                              <motion.button
                                key={emoji}
                                type="button"
                                role="menuitemradio"
                                aria-checked={myReaction === emoji}
                                whileTap={{ scale: 1.35 }}
                                onClick={() => {
                                  onReact(
                                    m.id,
                                    myReaction === emoji ? null : emoji,
                                  );
                                  setPicking(null);
                                }}
                                className={[styles.view18, myReaction === emoji ? styles.view19 : styles.view20, ""].filter(Boolean).join(" ")}
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div
                        role="button"
                        tabIndex={0}
                        aria-haspopup="menu"
                        aria-expanded={picking === m.id}
                        onClick={() =>
                          setPicking(picking === m.id ? null : m.id)
                        }
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          setPicking(picking === m.id ? null : m.id);
                        }}
                        className={["", grouped ? styles.view21 : mine ? styles.view22 : styles.view23, "", grouped ? (mine ? styles.view24 : styles.view25) : "", styles.view26].filter(Boolean).join(" ")}
                      >
                        {!mine && !grouped && (
                          <div
                            className={styles.view27}
                            style={{ color: nameColor(m.user_id) }}
                          >
                            <bdi>{m.display_name}</bdi>
                            {hosts.includes(m.user_id) && (
                              <span className={styles.view28}>
                                {g(room.host_gender, "היוצא", "היוצאת")}
                              </span>
                            )}
                          </div>
                        )}
                        <p
                          dir="auto"
                          className={styles.view29}
                        >
                          {m.body}
                        </p>
                        <div
                          className={[styles.view30, mine ? styles.view31 : styles.view32, ""].filter(Boolean).join(" ")}
                          dir="ltr"
                        >
                          {formatHour(Date.parse(m.created_at), tz)}
                          {mine && <Ticks />}
                        </div>
                      </div>
                      {chips.length > 0 && (
                        <div
                          className={[styles.view33, mine ? styles.view34 : styles.view35, ""].filter(Boolean).join(" ")}
                        >
                          {chips.map(({ emoji, count }) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() =>
                                onReact(
                                  m.id,
                                  myReaction === emoji ? null : emoji,
                                )
                              }
                              aria-label={`${emoji} ${count}${myReaction === emoji ? ", כולל שלך" : ""}`}
                              aria-pressed={myReaction === emoji}
                              className={[styles.view36, myReaction === emoji ? styles.view24 : styles.view25, ""].filter(Boolean).join(" ")}
                            >
                              <span aria-hidden>{emoji}</span>
                              {count > 1 && (
                                <span
                                  className={styles.view37}
                                  aria-hidden
                                >
                                  {count}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
}
