Here's a succinct list of the essential Vim commands:

### Navigation
- `h`: Left
- `j`: Down
- `k`: Up
- `l`: Right
- `gg`: Top of file
- `G`: Bottom of file
- `:{num}gg`/`:{num}G`: Specific line
- `w`: Next word
- `b`: Previous word
- `e`: End of word

### Editing Modes
- `i`: Insert before cursor
- `a`: Insert after cursor
- `o`: New line below
- `O`: New line above
- `Esc`: Exit insert mode

### Basic Editing
- `x`: Delete character
- `dw`: Delete word
- `dd`: Delete line
- `d$`: Delete to end of line
- `yy`: Copy line
- `p`: Paste after
- `P`: Paste before
- `u`: Undo
- `Ctrl + r`: Redo

### Search and Replace
- `/pattern`: Search forward
- `?pattern`: Search backward
- `n`/`N`: Repeat search
- `:%s/old/new/g`: Replace all
- `:%s/old/new/gc`: Replace with confirmation

### File Operations
- `:w`: Save
- `:q`: Quit
- `:wq`: Save and quit
- `:q!`: Quit without saving
- `:e filename`: Open file
- `:split filename`: Horizontal split
- `:vsplit filename`: Vertical split

### Advanced
- `v`: Visual mode
- `V`: Visual line mode
- `Ctrl + v`: Visual block mode
- `q{letter}`: Start macro
- `q`: Stop macro
- `@{letter}`: Play macro

