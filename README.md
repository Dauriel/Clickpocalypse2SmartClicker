# Updates after forking
Version 1.0.9

1. Added rudimentary skill tree strategy option for summoning parties. Prioritizes on skills that increase number of summons
2. Added custom summoning strategy for druid
   
# Clickpocalypse2Clicker [Forked x2]
Greasemonkey clickbot for Clickpocalypse II

This is a greasemonkey script for automating clicks in [Clickpocalypse II](http://minmaxia.com/c2/).  It simulates "legitimate" clicks and doesn't modify any internal game data or use "cheat" codes.

# Install

Requires [Greasymonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome. 

Download c2c.user.js and install as a user script.

# Strategies  

### Loot

* Always loots Chests, Bookcases and Weapon Racks when first entering a room.

### Quick bar

* Clicks all quickbar upgrades in reverse order ( ie, buys most expensive items first, under the assumption they are the better upgrade).

### Character Levels/Skills

* Default strategy: Upgrades skills in column order specified
* Summoning strategy: Upgrades skills maximizing those that increase number of summons. Order is set to minimize levels.

### Potions
* Farm potions ('Faster Infestation', 'Faster Farming' and 'More Kills Per Farm') and 'Fast Walking' will be used as soon as they are obtained since they are beneficial outside of combat.
* Scrolls potions ('Scrolls Auto Fire' and 'Infinite Scrolls') will not be used together.  Only one will be active as any given time since their functions overlap.
* Treasure Potions ('Random Treasure Room', 'Double Gold Drops' and 'Double Item Drops') aren't used if Scroll potions ('Scrolls Auto Fire' and 'Infinite Scrolls') are active (since it slows party down to much).  
* All non-farm potions will only be used during encounters.  This is so they aren't "wasted" while walking around in peaceful overworld.
* 'Potions Last Longer' is only used when you have 6 or more potions in inventory or if either Scroll Potion is active ('Scrolls Auto Fire' and 'Infinite Scrolls').

### Scrolls
* If 'Infinite Scrolls' potion is active, then all scroll types will be used 4/second on all encounters.
* If 'Scrolls Auto Fire' potion is active, no scrolls will used for normal encounters, since potion gives free use.  Will still use non-free scrolls during boss or difficult encounters.
* 'Spider Web' scrolls will be liberally (till none are left) on normal encounters and not fired during boss encounters (bosses are immune).
* All other scrolls will be fired at normal encounters, until only 15 are left.  This "reserve" quantity will be saved for boss encounters or "difficult encounters" (if one or more characters is stunned during fight).
* Scrolls will be used if quantity is greater than 29 (to make room to pick up more).

### Points Upgrade
* It will upgrade all AP Point Upgrades in as they are available.  The exception being 'Offline Time Bonus', it will never be clicked. (player can do manually if they wish).

### Game end/reset

* No logic, will not click anything if you beat the game.

# todos

* Add summoning strategies for other characters
* Add automatic prestige option

