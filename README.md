# Luke the Lumberjack

A full-screen browser woodland game. Luke starts in the Massachusetts woods with a tent and a rusty axe. Build a home, grow a workshop, help neighbors, get to know Olga, or explore for hidden caches and tool plans. There is no mandatory chapter checklist.

## Run

Requires Node.js 20 or newer. No dependencies to install.

```sh
node server.js
```

Open http://localhost:3000. `PORT` changes the server port. All game files can also be served by a static host. The optional Google Fonts stylesheet has system-font fallbacks.

## Deploy to GitHub Pages

The game is entirely client-side: GitHub Pages can serve it without running `server.js`, installing dependencies, or setting up a database. The included `.github/workflows/deploy-pages.yml` tests the game, builds a static `dist/` directory, and publishes it after each push to `main`. HTML asset paths and JavaScript imports are relative, so the game also works under `/LukeTheLumberjack/`.

### One-time setup

1. Open [this repository's Pages settings](https://github.com/TWSummer/LukeTheLumberjack/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions**. Skip the suggested workflow templates; this project already includes its workflow. See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Commit and push the deployment files from this project to `main`:

   ```sh
   git add .github/workflows/deploy-pages.yml scripts/build-pages.js .gitignore index.html package.json README.md
   git commit -m "Set up GitHub Pages deployment"
   git push origin main
   ```

4. Open the repository's [Actions tab](https://github.com/TWSummer/LukeTheLumberjack/actions) and wait for **Deploy game to GitHub Pages** to finish successfully. If you pushed before enabling Pages, choose that workflow, then **Run workflow → main → Run workflow** to try again.
5. Play at **https://TWSummer.github.io/LukeTheLumberjack/**. The successful deployment and **Settings → Pages** also show the published URL. The site is not live until the first deployment succeeds.

Future pushes to `main` redeploy automatically after the tests pass. No personal access token, custom secret, separate `gh-pages` branch, or generated `dist/` commit is needed. The workflow uses GitHub's built-in token and Pages deployment actions. If Pages is unavailable in settings, check the repository's visibility and your plan: public repositories support Pages on GitHub Free; private repositories require an eligible paid plan.

### Saves on the hosted site

The save format and key remain unchanged. Updates at the same site address preserve existing browser saves. However, saves are local to each browser and website origin: `localhost:3000` and `https://TWSummer.github.io` have separate storage. Your localhost adventure stays intact, but it does **not automatically appear on GitHub Pages**. The current game does not have a save import/export interface or cloud sync. See [how browser local storage is scoped](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

### Build locally

```sh
node --test tests/*.test.js
node scripts/build-pages.js
```

If npm is available, `npm test` and `npm run build` are equivalent. `dist/` contains only `index.html`, `styles.css`, `favicon.svg`, `src/`, and a `.nojekyll` marker. The build recreates this generated directory; do not edit it by hand. Serve it using any static HTTP server. The normal `node server.js` development command still serves the source project at port 3000.

## Controls

- **WASD / arrows:** walk. **Shift:** sprint, using **8 stamina per second**.
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

### Playing on a phone

Open the same game URL in your phone's browser. Touch controls appear automatically on touchscreens, and both portrait and landscape layouts are supported. There is no separate mobile game: the world, visuals, progression, quests, crafting jobs, and building rules are the same. Keyboard and mouse controls remain available, including on devices with both a keyboard and a touchscreen.

- **Walk:** tap open ground, or hold and slide the thumbstick in any direction. Small stick movements give fine control. Tap **Run** to toggle sprinting (8 stamina per second).
- **Chop / Mine:** tap a nearby resource or its action button once to keep working on that resource. It stops when depleted, when your tool/stamina cannot continue, or when you tap **Stop**, move, change targets, or open a menu. It never starts harvesting a different resource automatically.
- **Interact / Use / Talk / Gather:** the right-hand button changes to match the highlighted object. Tap **Next target** to reach nearby objects or overlapping house pieces.
- **Craft:** visit your tent or a workstation and tap **Use**. Choose a recipe, enter any whole-number quantity (or use **− / + / Max**), review total materials/output/time, and tap **Start crafting**. Leave it running, then return and collect the output. Workstations and tool service retain all their normal rules.
- **Build:** collect a kit or open **Packed kits**. Tap or drag the outline onto clear ground, then tap **Place**. Nudge arrows, **Rotate**, and **Grid on/off** give the same precision as keyboard placement. The thumbstick still moves Luke while placing. Cancelling a new kit keeps it packed; cancelling a move leaves the original piece in place.
- **Other controls:** Map, Journal, Backpack, Packed kits, Berries, and zoom **− / +** are onscreen. The pause menu includes sound, help, and a **Touch controls** setting: Automatic, Always show, or Hide.

Menus scroll internally by swiping. Controls account for screen cutouts and the home indicator. Releasing or cancelling a stick gesture, opening a menu, rotating the screen, or leaving the browser stops movement. Touch preferences use a separate storage key; the version-4 adventure save is unchanged. Like desktop saves, phone saves stay in that browser and do not sync between devices.

## A connected world

The surface world is 6,000 × 4,200 units with a camera that follows Luke. Pine Hollow, Whitmore’s Plot, Hemlock Ridge, Mosswater Brook, the Old Sugarbush, and the Forgotten Mill are neighborhoods in the same continuous map. Follow trails or walk off them; there are no travel buttons. A physical bunker hatch leads to a separate underground interior, and its stairs return to that same hatch.

The river blocks walking along its whole length. Bring **24 planks and 6 cord** to the broken Mosswater crossing and repair it in person. The boards visibly return, and you can walk over them to the eastern woods. The river remains impassable elsewhere.

Six discoveries provide resources and stories. The millwright’s chest unlocks logging-saw and prospector-pickaxe recipes. Jo, Mara, and Nell have optional quests with material rewards and lasting crafting, foraging, and food bonuses. A custom home and three friendships allow a gathering at your own long table, but do not end free play.

## Tent → workbench → workshop

Gather **6 wood, 4 stone, and 2 fiber**. Your rusty axe cuts tiny saplings; loose stones can be gathered by hand. Visit the tent with E and craft a workbench kit. Collect it, then place it on clear ground. The workbench makes other workstations, house kits, processed materials, and your first pickaxe.

Buildings cannot be made from a global construction catalog. Each is a physical kit crafted at a station, collected, and carried in the backpack. Placing it consumes the kit. Cancelling placement keeps it. House floors, walls, windows, doorways, roofs, beds, fences, and planters can be combined freely. Stations and furniture can sit on floors; roof tiles fade near Luke. Empty structures can be moved or packed by interacting with them.

Every station runs one independent job; multiple stations work simultaneously. A job takes materials from your inventory when started. Output stays at that station until collected locally. Choose a recipe, then type any positive whole-number quantity or use **− / + / Max**. The preview shows total inputs, output and time; **Max** uses the limiting ingredient in your backpack. Tool upgrades remain one at a time. Workbenches produce two planks per wood; sawmills produce six. A tool stays at its station during service and is upgraded only when collected. Unfinished jobs can be cancelled for a refund. Working stations and stations with uncollected output cannot be moved or packed.

## Tool progression

Five logging tiers have progressively greater power and faster swings:

- Rusty axe: tiny saplings, **1 wood**, eight hits.
- Honed axe: young pines, **6 wood**, five hits.
- Iron axe: mature pines, **24 wood**, five hits.
- Steel axe: old hardwoods, **65 wood plus 8 heartwood**, four hits.
- Logging saw: ancient white pines, **120 wood plus 20 heartwood**, three hits.

Larger trees require the corresponding tool. High-tier tools also fell lower-tier trees faster.

Four pickaxe tiers unlock fieldstone, iron-bearing boulders, dense outcrops, and quartz seams. Even soft fieldstone contains traces of ore, so mining can advance without completing a neighbor quest. Kilns smelt iron and make charcoal; forges produce steel and upgraded tools; precision benches produce the final saw and pickaxe after the plans are discovered.

Luke starts with **25 maximum stamina**. Sprinting consumes **8 stamina per second** while moving; an exhausted Luke walks until 5 stamina has recovered. Stamina regenerates at 1.4 per second while walking or standing, but not while sprinting, harvesting or training. Blueberries restore it immediately. Rest at the tent, a bed, or a campfire to restore stamina, replenish natural resources, and finish pending jobs. Rest does not collect those jobs or teleport Luke. Placed structures keep their footprints clear of regrowth.

## Training and Walter’s Boundary Dash

Craft a **woodland pull-up bar** at a workbench for **2 wood + 1 iron ingot**, collect the kit, and place it wherever you want to train. Interact at the bar and complete a **3-second pull-up**: it costs **3 stamina** and permanently adds **1 maximum stamina**, up to **100**. You must finish the repetition at the bar. Leaving cancels the repetition; training progress that is already earned is permanent. Rest and food refill only your current maximum.

**Walter “Lightning” Whitcomb**, the world's fastest 80-year-old, waits at a flagged racecourse on the far northern boundary, west of the river. Look on the map for **Walter’s Boundary Dash**. Every race wagers **1 wood** from your inventory. Walter gives you a breather before the countdown, refilling your trained capacity. Sprint to the opposite flag using **Shift + D / A**, or **Run + the thumbstick** on a phone. Stay within the marked lanes. Winning pays **2 wood** (both stakes); losing or leaving the lanes forfeits your wood. Food and rest are unavailable during races. Pause stops both runners, and an active race survives saving/reloading. Walter waits at the finish for unlimited rematches in the opposite direction.

The 2,400-unit course has fixed speeds: Walter runs at 296 units/second, and normal Luke sprints at 290. Even a perfect fully trained sprint narrowly loses. Find the golden **flower of swiftness** along the woodland trail north of Nell’s maple grove on the eastern bank. Take its unique cutting and plant it in an empty woodland planter in your garden. It grants a **5% sprint-speed boost while planted**, enough for a well-trained Luke to win. The bonus does not stack. Moving the planter keeps its flower; packing it returns the cutting and pauses the bonus. Olga’s moonbell can grow in a separate planter.

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

The stamina update also keeps version-4 progress. Saves from before training was introduced start at **25 maximum stamina**, with current energy scaled proportionally from the old 100-point meter. An exact one-time backup is retained under `luke-open-world-v4-before-stamina-training` if browser storage permits. Earned stamina, planted swiftness, Walter’s record and active wagers persist in later saves. No existing surface resource positions or IDs are changed.

## Verification

```sh
node --test tests/*.test.js
```

Tests cover world connectivity rules, the physical crossing, resource and tool gates, 120× wood-yield progression, starter self-sufficiency, crafting provenance, independent jobs, proximity checks, tool custody, pickup, refunds, placement layers, regrowth, save/resume, optional quests, the complete Olga sequence, actual room geometry, unique plant custody, crowbar crafting/pickup, bunker room accessibility, salvage, and repeating hermit dialogue. Expansion checks load an actual pre-expansion-format fixture and verify full progress preservation, an unchanged surface-map hash, every original walkable position, permanent barriers, renewable seams, power/drainage collision, tool gates, wall occlusion, reachable branches, shortcuts, and the salvage-plan recipe.

For isolated browser testing, start a second server on port 3001 and open `/tests/open-world-playtest.html`, `/tests/story-playtest.html`, or `/tests/bunker-playtest.html`. Their visible controls seed test scenarios and hold keyboard inputs in the embedded game. The bunker fixture also resumes the original version-4 save fixture. The fixtures refuse to seed the normal port-3000 adventure.

`/tests/mobile-playtest.html` offers full-screen touch scenarios for crafting, building, chopping, mining, gathering, and bunker salvage on `localhost:3001` only. Test portrait and landscape sizes, tap-only crafting and placement, target cycling, harvesting cancellation, and keyboard use with touch controls shown/hidden. Pointer tests cover diagonal speed, fine movement, multiple-finger ownership, release, cancellation, lost capture, and resets. Development fixtures are excluded from the Pages build.

The activity tests additionally cover arbitrary crafting quantities, exact refunds and large-job resume, stamina migration/backups and caps, movement-based sprint costs, timed/local training, swiftness custody, and race outcomes at 30/60/144 fps in both directions. `/tests/activity-playtest.html` provides isolated crafting, training, garden, and race scenarios, plus full-screen touch testing.

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
- `src/activity-data.js`, `src/activities.js`, `src/activity-ui.js`, `src/activity-art.js`: stamina training, swiftness, Walter’s fixed-speed races, course, and activity interactions.
- `src/crafting-ui.js`: recipe quantities, Max, cost/output/time preview, and job confirmation.
- `src/main.js`: collision, movement, input, harvesting, sound, and the game loop.
- `src/touch-controls.js`: thumbstick pointer capture, touch detection/preferences, and contextual onscreen actions.
- `styles.css`: full-screen HUD and responsive overlays.
