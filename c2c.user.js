// ==UserScript==
// @name        Clickpocalypse2Clicker
// @namespace   C2C
// @description Clicker Bot for Clickpocalypse2
// @include     http://minmaxia.com/c2/
// @include     https://minmaxia.com/c2/
// @version     1.0.9
// @grant       none
// @require https://code.jquery.com/jquery-3.1.0.slim.min.js
// ==/UserScript==

// This saves scrolls for boss encounters.
var scrollReserve = 15;

// This will fire scrolls no matter what, if we hit this limit... (so we can pick up new scrolls).
var scrollUpperBound = 29;
// char names shown on the menu tab
const CHAR_CLASS_LIST = [
  "Fighter",
  "Priest",
  "Ranger",
  "Pyro",
  "Rogue",
  "Druid",
  "Barbarian",
  "Electro",
  "Ninja",
  "Necro",
  "King",
  "Spider Lord"
];


// 1 for default strategy, 2 for summoning strategy
const strategytype = {
  "Fighter": 1,
  "Priest": 1,
  "Ranger": 1,
  "Pyro": 1,
  "Rogue": 1,
  "Druid": 0,
  "Barbarian": 1,
  "Electro": 1,
  "Ninja": 1,
  "Necro": 0,
  "King": 1,
  "Lord": 1,
}

// default points upgrade strategy
const skillStrategy = {
  "Fighter": [0, 1, 2, 3],
  "Priest": [2, 1, 4, 0],
  "Ranger": [0, 1, 2, 3],
  "Pyro": [3, 2, 1, 0],
  "Rogue": [3, 2, 1, 0],
  "Druid": [0, 3, 1, 2],
  "Barbarian": [0, 1, 3, 2],
  "Electro": [3, 2, 1, 0],
  "Ninja": [0, 3, 1, 2],
  "Necro": [1, 2, 0, 3],
  "King": [0, 1, 2, 3],
  "Lord": [0, 3, 1, 2],
};

// rudimentary summoning strategy. [col, row]
const customStrategy = {
  "Druid": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [1, 1], [1, 2], [2, 8], [0, 7], [0, 8], [3, 0], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8]],
  "Necro": [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [1, 5], [1, 6], [1, 7], [1, 8], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]],
}

// interval time
const INTERVAL = 1000;

let configs = {
  autoPoint: false,
  autoSkill: true,
  autoScroll: true,
  autoPotion: true,
  autoLoot: true,
  windowScale: 1
};

function updateConfig(name) {
  return function () {
    if ([
      "autoPoint",
      "autoSkill",
      "autoScroll",
      "autoPotion",
      "autoLoot",
    ].includes(name)) {
      configs[name] = !configs[name];
      rendMenu();
    } else if ([
      "windowScale",
    ].includes(name)) {
      // validate scale value
      if (isNaN(this.value)) {
        alert("Window transform scale must be a valid number");
        return;
      }
      configs.windowScale = parseFloat(this.value);
      $("#gameContainer").css("transform-origin", "top");
      $("#gameContainer").css("transform", `scale(${configs.windowScale})`);
    } else {
      throw new error("invalid config object");
    }
  }
}

function rendMenu() {
  let container = $("#script-ui");
  container.empty();
  let markup = `
		 <table>
        <tr>
          <td align=right>Auto AP Point:</td>
          <td style="padding-left: 10px"><button id="config-auto-point">${configs.autoPoint ? "ON" : "OFF"}</button></td>
        </tr>
        <tr>
          <td align=right>Auto Skill:</td>
          <td style="padding-left: 10px"><button id="config-auto-skill">${configs.autoSkill ? "ON" : "OFF"}</button></td>
        </tr>
        <tr>
          <td align=right>Auto Potion:</td>
          <td style="padding-left: 10px"><button id="config-auto-potion">${configs.autoPotion ? "ON" : "OFF"}</button></td>
        </tr>
        <tr>
          <td align=right>Auto Scroll:</td>
          <td style="padding-left: 10px"><button id="config-auto-scroll">${configs.autoScroll ? "ON" : "OFF"}</button></td>
        </tr>
        <tr>
          <td align=right>Auto Loot:</td>
          <td style="padding-left: 10px"><button id="config-auto-loot">${configs.autoLoot ? "ON" : "OFF"}</button></td>
        </tr>
        <tr>
          <td align=right>Window Scale:</td>
          <td style="padding-left: 10px"><input id="config-window-scale" style="width: 30px" type="text" value="${configs.windowScale}"></input></td>
        </tr>
      </table> 
	`;
  container.append($(markup));
  $("#config-auto-point").click(updateConfig("autoPoint"));
  $("#config-auto-skill").click(updateConfig("autoSkill"));
  $("#config-auto-scroll").click(updateConfig("autoScroll"));
  $("#config-auto-potion").click(updateConfig("autoPotion"));
  $("#config-auto-loot").click(updateConfig("autoLoot"));
  $("#config-window-scale").change(updateConfig("windowScale"));
}

$(document).ready(function () {

  console.log("Add script manager UI");
  $("body").append($(`<div id='script-ui' style="background: #000;position: fixed;bottom: 15px;right: 15px; padding: 10px; border: 1px solid #1e1b1b;"></div>`));
  rendMenu();

  console.log('Starting Clickpocalypse2Clicker: ' + GM_info.script.version);

  setInterval(function () {
    let charClasses = findClasses();
    if (!charClasses || !charClasses.length) return; // this means the game is not started

    // ------------------------------------ BOSS strategy ------------------------------------
    // Determines our encounter states
    var isBossEncounter = ($('.bossEncounterNotificationDiv').length != 0);
    var isEncounter = ($('#encounterNotificationPanel').css('display') !== 'none');
    //console.log("Boss: " +isBossEncounter +" Normal: " +isEncounter);

    // Determine if this is a difficult encounter... (one or more characters are stunned).
    //todo: should cancel search once we find it to be true.
    var isDifficultEncounter = false;
    // slot positions.
    var pos = ['A', 'B', 'C', 'E', 'E', 'F'];
    $.each(pos, function (idx) {
      var letter = pos[idx];

      // character positions.
      for (var char = 0; char < 5; char++) {

        var name = '#adventurerEffectIcon' + letter + char;
        var selector = $(name);
        //console.log("Checking: " + name + " Title: " + selector.attr('title') + " Display " + selector.css('display') + " HTML: " +selector.html());
        if (selector.attr('title') === 'Stunned' && selector.css('display') !== 'none') {
          isDifficultEncounter = true;

        }
      }
    });

    //console.log("isDifficultEncounter: " + isDifficultEncounter);

    // --------------------------------------- Loot ---------------------------------------
    // loot them chests... not sure which one of these is working.
    if (configs.autoLoot) {
      clickSelector($('#treasureChestLootButtonPanel').find('.gameTabLootButtonPanel'));
      clickSelector($('#treasureChestLootButtonPanel').find('.lootButton'));

      // Cycle though all quick bar upgrades in reverse order.
      for (var i = 43; i >= 0; i--) {
        clickIt('#upgradeButtonContainer_' + i);
      }
    }
    // --------------------------------------- AP points -----------------------------------
    // Update AP Upgrades
    if (configs.autoPoint) {
      for (var row = 0; row < 12; row++) {
        // skip 'Offline Time Bonus' upgrade.
        if (row == 3) {
          continue;
        }
        for (var col = 0; col < 2; col++) {

          var name = "#pointUpgradesContainer_" + row + "_" + col + "_" + row;

          clickIt(name);
        }
      }
    }
    // ----------------------------------------- potions ----------------------------------------
    if (configs.autoPotion) {
      // Get information about potions are active before taking any actions
      var isPotionActive_ScrollsAutoFire = false;
      var isPotionActive_InfinteScrolls = false;
      var potionCount = 0;

      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 2; col++) {

          var potionSelector = $('#potionButton_Row' + row + '_Col' + col).find('.potionContentContainer');
          var potionName = potionSelector.find('td').eq(1).text();
          var potionActive = (potionSelector.find('.potionButtonActive').length != 0);

          if (potionName.length == 0) {
            continue;
          }

          potionCount++;

          if (potionName === 'Scrolls Auto Fire') {
            isPotionActive_ScrollsAutoFire = potionActive;
          }
          if (potionName === 'Infinite Scrolls') {
            isPotionActive_InfinteScrolls = potionActive;
          }

        }
      }

      //console.log ("AF: " +isPotionActive_ScrollsAutoFire +" IS: " +isPotionActive_InfinteScrolls +" Potion Count: " +potionCount );

      // Click them potions
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 2; col++) {

          var potionSelector = $('#potionButton_Row' + row + '_Col' + col).find('.potionContentContainer');
          var potionName = potionSelector.find('td').eq(1).text();
          var potionActive = (potionSelector.find('.potionButtonActive').length != 0);

          if (potionName.length == 0) {
            continue;
          }
          if (potionActive) {
            continue;
          }

          // We don't want to use AutoFire and InfinteScrolls together, since they have similar functions.
          if (potionName === 'Infinite Scrolls' && isPotionActive_ScrollsAutoFire) {
            continue;
          }
          if (potionName === 'Scrolls Auto Fire' && isPotionActive_InfinteScrolls) {
            continue;
          }

          // Always click farm bonus or fast walking potions as soon as we get them, since they are useful anywhere.
          if (potionName === 'Faster Infestation' || potionName === 'More Kills Per Farm' || potionName === 'Faster Farming' || potionName === 'Fast Walking') {
            clickSelector(potionSelector);
            continue;
          }


          // Only click these if we are in battle, no need to chug potions if we are walking around peaceful overworld.
          if (isBossEncounter || isEncounter) {

            if (potionName === 'Infinite Scrolls') {
              isPotionActive_InfinteScrolls = true;
            }
            if (potionName === 'Scrolls Auto Fire') {
              isPotionActive_ScrollsAutoFire = true;
            }

            if (potionName === 'Potions Last Longer') {
              if (potionCount < 6 && !(isPotionActive_InfinteScrolls || isPotionActive_ScrollsAutoFire)) {
                continue;
              }
            }

            if ((potionName === 'Random Treasure Room' || potionName === 'Double Item Drops' || potionName === 'Double Gold Drops')
              && (isPotionActive_InfinteScrolls || isPotionActive_ScrollsAutoFire)) {
              continue;
            }

            clickSelector(potionSelector);
          }

        }
      }
    }
    // ------------------------------------ scrolls ------------------------------------------
    if (configs.autoScroll) {
      // Get info about scrolls before taking any action.
      var totalScrolls = 0;
      for (var i = 0; i < 6; i++) {

        var scrollCell = $('#scrollButtonCell' + i);
        var scrollButton = scrollCell.find('.scrollButton');
        var scrollAmount = scrollCell.find('tr').eq(1).text().replace('x', '');;

        if (!scrollAmount.length) {
          continue;
        }

        if (scrollAmount === 'Infinite' || isPotionActive_InfinteScrolls) {
          break;
        }

        // Don't count spider webs
        if (i != 1) {
          totalScrolls += parseInt(scrollAmount);
        }

      }

      //console.log("Total Scrolls:" +totalScrolls);


      // click them scrolls
      for (var i = 0; i < 6; i++) {

        var scrollCell = $('#scrollButtonCell' + i);
        var scrollButton = scrollCell.find('.scrollButton');
        var scrollAmount = scrollCell.find('tr').eq(1).text().replace('x', '');;

        if (!scrollAmount.length) {
          continue;
        }

        // Hitting limit, fire scrolls so we can pick up new ones.
        if (scrollAmount > scrollUpperBound) {
          clickSelector(scrollButton);
          continue;
        }


        // Spam spells if Infinite Scrolls potion is active.
        if (scrollAmount === 'Infinite' || isPotionActive_InfinteScrolls) {

          // 4 times per second
          clickSelector(scrollButton);
          setTimeout(clickSelector, 250, scrollButton);
          setTimeout(clickSelector, 500, scrollButton);
          setTimeout(clickSelector, 750, scrollButton);
          continue;
        }

        // Fire 0 scrolls if Autofire is active... it fires them for free, so let's not waste ours.
        // unless boss encounter, we still want to double up on the big guys...
        if (isPotionActive_ScrollsAutoFire && !isBossEncounter && !isDifficultEncounter) {
          continue;
        }

        // 1 === spider web scroll.  Always fire at normal encounters.
        // Boss are immune to spider web, so won't fire them.
        if (i == 1 && !isBossEncounter) {
          clickSelector(scrollButton);
        }


        if (i != 1) {

          // keep scrolls in reserve if generic encounter so we have them for boss.
          // No limit if this is a boss encounter
          if (scrollAmount > scrollReserve || isBossEncounter || isDifficultEncounter) {
            clickSelector(scrollButton);
          }
        }
      }
    }

  }, INTERVAL);

  // ---------------------------- skill interval -------------------------------

  let clicked = null;
  setInterval(function () {
    if (!hasSkillPoint()) {
      // nothing to be upgraded
      clicked = null;
      return;
    }
    if (configs.autoSkill) {
      let charClasses = findClasses();
      if (!charClasses || !charClasses.length) return; // this means the game is not started

      if (!clicked) clicked = new Array(charClasses.length).fill([]);
      // Level up character skills.
      // Note: the strategy will NOT work properly while you have >1 skill points, becuase a "clickable" skill will be refreshed
      // after a certion time while you just upgrade one. At the same time, the other "clickable" skills will be clicked during
      // that certian time. a solution would be up grade only 1 skill for each class at one interval.
      loopChar: for (var charPos = 0; charPos < charClasses.length; charPos++) {

        if (strategytype[charClasses[charPos]]) {
          //console.log("Upgrading skills for " + charClasses[charPos] + " using default strategy");
          let strategy = skillStrategy[charClasses[charPos]];
          loopStrategy: for (var s of strategy) {
            loopRow: for (var row = 0; row < 9; row++) {
              // There is an ending col on all, not sure why yet
              let id = charPos + '_' + row + '_' + s + '_' + row;
              if (clicked[charPos].indexOf(id) < 0) {
                clickIt('#characterSkillsContainer' + id);
                clicked[charPos].push(id);
                //console.log("Upgraded skill for " + charClasses[charPos] + " using default strategy at column" + s + "row" + row)
                break loopStrategy; // done for this char
              }
            }
          }
        } else {
          //console.log("Upgrading skills for " + charClasses[charPos] + " using custom strategy");
          let strategy = customStrategy[charClasses[charPos]];

          // let's find the current index of the summon strategy
          loopStrategy: for (var s of strategy) {
            // There is an ending col on all, not sure why yet
            let id = charPos + '_' + s[1] + '_' + s[0] + '_' + s[1];
            if (clicked[charPos].indexOf(id) < 0) {
              clickIt('#characterSkillsContainer' + id);
              clicked[charPos].push(id);
              //console.log("Upgraded skill for " + charClasses[charPos] + " using custom strategy at column" + s[0] + "row" + s[1])
              break loopStrategy; // done for this char
            }
          }
        }
      }
    }
  }, INTERVAL);

});
// -------------------------------- helpers -----------------------------------
/*** Click by div id **/
function clickIt(divName) {
  var div = $(divName);
  if (!div.length) {
    return;
  } // They use mouse up instead of click()

  div.mouseup();
}
/*** Click by Selector **/
function clickSelector($selector) {
  $selector.mouseup();
}
// find char classes
function findClasses() {
  let charClasses = [];
  let elements = document.querySelectorAll("#gameTabMenu li a");
  if (elements && elements.length)
    elements.forEach(function (e) {
      let name = e.text.split(" ")[0];
      if (CHAR_CLASS_LIST.indexOf(name) <= 0) return;
      charClasses.push(name);
    });
  return charClasses;
}
// check if have available skill points
function hasSkillPoint(charClasses) {
  let elements = document.querySelectorAll("#gameTabMenu li a");
  let hasPoint = false;
  if (elements && elements.length)
    elements.forEach(function (e) {
      let name = e.text.split(" ")[0];
      if (CHAR_CLASS_LIST.indexOf(name) <= 0) return;
      if (e.text.split(" ").length > 1) hasPoint = true;
    });
  return hasPoint;
}

// --------------------------------- hack ----------------------------------
/* savefile related */
// NOTE: this won't work in GreaseMonkey, since @grant: none
// you can use this code in your console menually to edit your savefile.
function readSave() {
  return JSON.parse(fa.eD(localStorage.getItem(w.pg.Zp)), true);
}
function writeSave(obj) {
  localStorage.setItem(w.pg.Zp, fa.cD(JSON.stringify(obj)));
}

