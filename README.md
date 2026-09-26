# Luke the Lumberjack

A full-screen browser woodland game. Luke starts in the Massachusetts woods with a tent and a rusty axe. Build a home, grow a workshop, help neighbors, get to know Olga, or explore for hidden caches and tool plans. There is no mandatory chapter checklist.

## Run

Requires Node.js 20 or newer. No dependencies to install.

```sh
node server.js
```

Open http://localhost:3000. `PORT` changes the server port. All game files can also be served by a static host. The optional Google Fonts stylesheet has system-font fallbacks.

## Controls

- **WASD / arrows:** walk. **Shift:** move faster.
- **Hold Space:** repeatedly chop or mine a nearby resource with the appropriate tool.
- **E:** gather plants or loose stones, talk, investigate, or use a station.
- **Tab:** cycle nearby targets, including layered house pieces.
- **1 / 2:** select axe or pickaxe. Resource harvesting automatically uses the correct tool.
- **B:** backpack. **V:** collected building kits. **F:** eat berries.
- **M:** reference map (no fast travel). **J:** optional goals and neighbor stories.
- **H:** help. **Escape:** close a panel, cancel placement, or pause.
- **− / +:** zoom the camera.
- **Menus:** Up/Down or W/S selects a button; Enter confirms; Tab moves focus. Q/R switches crafting tabs. Page Up/Down scrolls panels; arrows also scroll panels that contain only text.
- **Placing:** WASD walks Luke; arrow keys nudge the outline; R rotates; G toggles grid snapping; Enter places; Escape keeps the kit packed. Mouse placement and touch controls are also available.

The canvas fills the viewport. HUD elements are overlays. The page itself never scrolls; long inventory and crafting panels scroll internally and follow keyboard focus.

## A connected world

The surface world is 6,000 × 4,200 units with a camera that follows Luke. Pine Hollow, Whitmore’s Plot, Hemlock Ridge, Mosswater Brook, the Old Sugarbush, and the Forgotten Mill are neighborhoods in the same continuous map. Follow trails or walk off them; there are no travel buttons. A physical bunker hatch leads to a separate underground interior, and its stairs return to that same hatch.

The river blocks walking along its whole length. Bring **24 planks and 6 cord** to the broken Mosswater crossing and repair it in person. The boards visibly return, and you can walk over them to the eastern woods. The river remains impassable elsewhere.

Six discoveries provide resources and stories. The millwright’s chest unlocks logging-saw and prospector-pickaxe recipes. Jo, Mara, and Nell have optional quests with material rewards and lasting crafting, foraging, and food bonuses. A custom home and three friendships allow a gathering at your own long table, but do not end free play.

## Tent → workbench → workshop

Gather **6 wood, 4 stone, and 2 fiber**. Your rusty axe cuts tiny saplings; loose stones can be gathered by hand. Visit the tent with E and craft a workbench kit. Collect it, then place it on clear ground. The workbench makes other workstations, house kits, processed materials, and your first pickaxe.

Buildings cannot be made from a global construction catalog. Each is a physical kit crafted at a station, collected, and carried in the backpack. Placing it consumes the kit. Cancelling placement keeps it. House floors, walls, windows, doorways, roofs, beds, fences, and planters can be combined freely. Stations and furniture can sit on floors; roof tiles fade near Luke. Empty structures can be moved or packed by interacting with them.

Every station runs one independent job; multiple stations work simultaneously. A job takes materials from your inventory when started. Output stays at that station until collected locally. Material and kit batches can contain 1, 5, or 10 runs. Workbenches produce two planks per wood; sawmills produce six. A tool stays at its station during service and is upgraded only when collected. Unfinished jobs can be cancelled for a refund. Working stations and stations with uncollected output cannot be moved or packed.

## Tool progression

Five logging tiers have progressively greater power and faster swings:

- Rusty axe: tiny saplings, **1 wood**, eight hits.
- Honed axe: young pines, **6 wood**, five hits.
- Iron axe: mature pines, **24 wood**, five hits.
- Steel axe: old hardwoods, **65 wood plus 8 heartwood**, four hits.
- Logging saw: ancient white pines, **120 wood plus 20 heartwood**, three hits.

Larger trees require the corresponding tool. High-tier tools also fell lower-tier trees faster.

Four pickaxe tiers unlock fieldstone, iron-bearing boulders, dense outcrops, and quartz seams. Even soft fieldstone contains traces of ore, so mining can advance without completing a neighbor quest. Kilns smelt iron and make charcoal; forges produce steel and upgraded tools; precision benches produce the final saw and pickaxe after the plans are discovered.

Stamina regenerates slowly when not harvesting. Blueberries restore it immediately. Rest at the tent, a bed, or a campfire to restore stamina, replenish natural resources, and finish pending jobs. Rest does not collect those jobs or teleport Luke. Placed structures keep their footprints clear of regrowth.

## Olga: a life taking root

Meet blonde gardener **Olga by the lost orchard**, west of the trail from Pine Hollow to Hemlock Ridge. Her optional four-part story follows what you do in the world:

1. **A cut above:** after accepting, fell three young pines or larger trees. Tiny saplings and wood already in your backpack do not count. Keep the wood; earn planks and cord.
2. **Something worth growing:** find the silver-blue moonbell south of the giant’s grove on the eastern bank. Take one cutting, craft and place a woodland planter, then use **E at the planter** to plant it. Return to Olga; her reward includes an invitation to a date.
3. **Room for two at the overlook:** accept her invitation, then walk to the picnic beside the heron overlook. Talk to Olga there to spend the afternoon together.
4. **A room of our own:** Olga asks to move in. Build two enclosed rooms connected by a doorway, with a bed in each. Her room needs at least four connected floor tiles, matching roof tiles, a complete boundary of walls/doors, and a window. Walls sit on floor edges; rotate them for vertical edges. Any location and room outline work. Tell Olga when it is ready; she moves to your home and gains new dialogue.

The journal tracks progress, and Olga’s map marker follows her between the orchard, picnic, and home. Moving a planted planter retains its flower. Packing it returns both the planter kit and the cutting, so rearranging the garden cannot lose the quest plant. The wild parent plant is never depleted by resting or harvested twice.

## The abandoned bunker

Follow the spur northeast of Jo’s workshop to the concrete hatch. Make a **crowbar at a toolsmith’s forge (4 iron ingots + 2 wood)** and collect it locally. Use E at the hatch to pry it open and climb down. The hatch stays open and the crowbar stays in your backpack.

The bunker has **13 rooms and chambers across 11 map sectors**, including the original entrance quarters, a machine shop, generator hall, records archive, barracks, pumpworks, sunless garden, buried quarry, cistern, crystal galleries, and a survey vault. Explore branching routes, 11 one-time caches, seven readable notes, and recurring mineral deposits. The map names sectors as you enter them.

- **Hold Space** to chop shipping crates and collapsed shelving with an axe, or break cave-ins and mine seams with a pickaxe. The appropriate tool is selected automatically. Higher-tier obstacles and quartz need better tools. Cleared barriers remain visibly gone and can be walked through.
- The first service barricade accepts any axe. The machine shop branches toward heavy pallets (honed axe) or a rubble-choked barracks passage (stone pick). Supplies found or salvaged here can repair the generator.
- **Repair the generator with 6 scrap and 4 copper wire**, using E at its control panel. This restores lights, opens the archive door, and supplies power to the pumps.
- **Operate the drainage controls** in the pumpworks to empty the flooded passages and cistern pool. Water visibly recedes, opening the lower routes. There is no additional material cost.
- Release the **emergency return bulkhead from the barracks side** for a permanent shortcut to Gerald and the entrance stairs.
- The survey vault lies beyond thick shipping timbers that need an iron axe. Its engineering plans unlock **reclaiming two steel from 3 scrap and 1 charcoal at a forge**, through normal crafting and local pickup.

**Machine scrap** also becomes three iron ingots per piece at a kiln. **Copper wire, scrap, and lantern-cap cultures** make glow lantern kits at a workbench; collect and place them around your house or garden. Ore seams and living cultures replenish on a new day. Shipping crates, cleared passage barriers, read notes, restored machinery, and searched caches remain cleared or completed. Partial harvesting damage survives saving. Walls and locked passages block both walking and interaction through them.

**Gerald “Abandoned” Moss**, the resident hermit, now cycles through eleven unsolicited opinions. He has no quests and no progression gate. His home is not a building site. Use E at the original entrance stairs to return to the same hatch in the woods.

## Saves and iteration

**The bunker expansion preserves existing version-4 saves** under the same local-storage key, `luke-open-world-v4`. Inventory, tools, placed buildings, packed kits, crafting jobs, quest progress, and player position carry over. The original entrance rooms, hatch, Gerald, and three existing caches retain their positions and IDs. Surface resource IDs and positions are unchanged. New bunker fields receive defaults without replacing existing progress.

Before loading a pre-expansion save, the game keeps its original serialized data under `luke-open-world-v4-before-bunker-expansion` in the same browser, if storage permits. This backup is written once and is not overwritten by later autosaves. Progress—including new cleared barriers, damaged deposits, machinery, discoveries, and new loot—continues saving automatically. No backend account is required.

## Verification

```sh
node --test tests/*.test.js
```

Tests cover world connectivity rules, the physical crossing, resource and tool gates, 120× wood-yield progression, starter self-sufficiency, crafting provenance, independent jobs, proximity checks, tool custody, pickup, refunds, placement layers, regrowth, save/resume, optional quests, the complete Olga sequence, actual room geometry, unique plant custody, crowbar crafting/pickup, bunker room accessibility, salvage, and repeating hermit dialogue. Expansion checks load an actual pre-expansion-format fixture and verify full progress preservation, an unchanged surface-map hash, every original walkable position, permanent barriers, renewable seams, power/drainage collision, tool gates, wall occlusion, reachable branches, shortcuts, and the salvage-plan recipe.

For isolated browser testing, start a second server on port 3001 and open `/tests/open-world-playtest.html`, `/tests/story-playtest.html`, or `/tests/bunker-playtest.html`. Their visible controls seed test scenarios and hold keyboard inputs in the embedded game. The bunker fixture also resumes the original version-4 save fixture. The fixtures refuse to seed the normal port-3000 adventure.

## Source layout

- `src/data.js`: tools, resources, recipes, stories, discoveries, and icons.
- `src/world.js`: continuous terrain, paths, river, landmarks, and seeded resource placement.
- `src/state.js`: inventory, harvesting, jobs, tool upgrades, quests, and saves.
- `src/story-data.js` / `src/stories.js`: Olga’s quest chain, bunker layout, salvage, and dialogue rules.
- `src/bunker-data.js`, `src/bunker-geometry.js`, `src/bunker.js`: expanded bunker layout, collision and reachability, resource harvesting, power, drainage, and exploration.
- `src/bunker-art.js`: bunker terrain, salvage sprites, machinery, floodwater, and exploration maps.
- `src/rooms.js`: connected and enclosed room validation for moving in.
- `src/story-ui.js` / `src/story-art.js`: story interactions, plant and bunker art, and interior maps.
- `src/construction.js`: station-produced building kits, footprints, and placement validation.
- `src/renderer.js`: following camera, cached terrain tiles, culling, bridges, and maps.
- `src/sprite-art.js` / `src/building-renderer.js`: procedural woodland, character, and structure art.
- `src/ui.js`: keyboard panels, physical crafting, backpack, and kit placement.
- `src/main.js`: collision, movement, input, harvesting, sound, and the game loop.
- `styles.css`: full-screen HUD and responsive overlays.
