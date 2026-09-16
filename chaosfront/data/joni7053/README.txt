MODの導入にはBepInEx x64版が必要です（ https://github.com/BepInEx/BepInEx/releases ）

■ BepInEx x64版 インストール手順
1. Steamライブラリでゲームを右クリック ＞「管理」＞「ローカルファイルを閲覧」を選択します（例: C:\Program Files (x86)\Steam\steamapps\common\ゲーム名\）。
2. GitHubから「BepInEx_x64_バージョン.zip」をダウンロードして解凍し、中の全ファイル（BepInExフォルダ、doorstop_config.ini、winhttp.dllなど）をゲームのインストールフォルダ（.exeがある場所）にコピーします。
3. インストールフォルダ内にできる「ゲームフォルダ\BepInEx\plugins\」フォルダの中に、導入したいMODの「.dllファイル」をコピー＆ペーストします。
4. ゲームを起動します。

■ 導入MOD一覧
【InfiniteRandomMissions.dll】（メインMOD）
・概要: 毎月初めに、バニラのミッションをベースにし敵をランダムに（バニラミッションと敵の数は変わらない）置き換えるミッションが10個自動生成されます（ミッションは毎月初めに入れ替わり）。
・特徴: ミッション名の先頭に「★」付き。勝利条件は敵の殲滅、敗北条件は全滅または20ターン超過（戦場情報の条件は無視）。艦船の捕縛も可能。
・【注意】：生成されたミッションを受注中にこのMODを外すとセーブデータが破損します。必ずミッションをキャンセルするかクリアしてから外してください。

※オプションMOD（単独でも機能します）
【ChaosFrontCaptureBonusMod.dll】（オプション）
・概要: 敵のHP・ENの減少率に応じて捕縛率にボーナスが加算されます。設定はゲーム画面の「オプション」＞「システム設定」＞「システム」タブから変更可能。
・【注意】：他の捕縛率変更MODとは併用しないでください。

【LevelUncapMod.dll】（オプション）
・概要: キャラおよび機体のレベル上限を99に変更します。導入すると難易度8以上の生成ミッションの敵レベルがプレイヤーの最高レベルに合わせて自動上昇します。
・【注意】：キャラクターのレベルが10を超えると、団員図鑑のレベル表示が合わなくなるバグがあります。

【SellRenownMod.dll】（オプション）
・概要: 任務センターで「名声」の売買ができるようになります（レベルを上げることはできますが下げることはできません）。


Requires BepInEx x64 ( https://github.com/BepInEx/BepInEx/releases )

■ BepInEx x64 Installation Guide
1. Right-click the game in your Steam Library, select "Manage" > "Browse local files" (Example: C:\Program Files (x86)\Steam\steamapps\common\GameName\).
2. Download "BepInEx_x64_version.zip" from GitHub, extract it, and copy all files and folders (BepInEx folder, doorstop_config.ini, winhttp.dll, etc.) directly into the game's installation folder (where the .exe is located).
3. Copy and paste the ".dll file" of the mod you want to install into the following folder created inside the installation folder: GameFolder\BepInEx\plugins\
4. Launch the game.

■ Included Mods
[InfiniteRandomMissions.dll] (Main Mod)
- Overview: Automatically generates 10 random missions at the beginning of every month by randomly replacing enemies based on vanilla missions (the number of enemies stays the same as the vanilla mission, and the missions rotate every month).
- Features: Missions have a "★" prefix. Victory condition is enemy annihilation; defeat condition is total annihilation or exceeding 20 turns (ignore battlefield info conditions). Ship capture is also available.
- [WARNING]: Removing this mod while having an auto-generated mission accepted will corrupt your save data. Always cancel or clear the mission before removing the mod.

* Optional Mods (Work independently)
[ChaosFrontCaptureBonusMod.dll] (Optional)
- Overview: Grants capture rate bonuses based on the reduction rate of enemy HP and EN. Settings can be changed from the game screen via "Options" > "System Settings" > "System" tab.
- [WARNING]: Do not use in combination with other capture rate modification mods.

[LevelUncapMod.dll] (Optional)
- Overview: Raises the level cap for characters and mechs to 99. When installed, enemy levels for auto-generated missions of difficulty 8 and above scale to match the player's highest level.
- [WARNING]: If a character's level exceeds 10, a bug occurs where their level display in the member roster (encyclopedia) becomes misaligned.

[SellRenownMod.dll] (Optional)
- Overview: Allows buying and selling of "Renown" at the Mission Center (Renown levels can be increased, but cannot be decreased).