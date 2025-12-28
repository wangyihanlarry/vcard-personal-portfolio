# vCard - Personal portfolio

![GitHub repo size](https://img.shields.io/github/repo-size/codewithsadee/vcard-personal-portfolio)
![GitHub stars](https://img.shields.io/github/stars/codewithsadee/vcard-personal-portfolio?style=social)
![GitHub forks](https://img.shields.io/github/forks/codewithsadee/vcard-personal-portfolio?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/codewithsadee_?style=social)](https://twitter.com/intent/follow?screen_name=codewithsadee_)
[![YouTube Video Views](https://img.shields.io/youtube/views/SoxmIlgf2zM?style=social)](https://youtu.be/SoxmIlgf2zM)

vCard is a fully responsive personal portfolio website, responsive for all devices, built using HTML, CSS, and JavaScript.

## Internationalization (i18n) Support

This version of vCard includes internationalization support for the following languages:
- English (default)
- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW, zh-HK)

### Language Detection

The website automatically detects the user's browser language preference using the `Accept-Language` header:
- `zh-CN` or `zh-cn` → Simplified Chinese
- `zh-TW`, `zh-tw`, `zh-HK`, or `zh-hk` → Traditional Chinese
- All other languages → English

### Implementation Details

The i18n system is implemented using:
- **assets/js/i18n.js** - Core internationalization logic with translation configurations
- **assets/css/style.css** - Updated font stack to support Chinese characters
- Automatic DOM updates on page load
- Proper HTML `lang` attribute updates for accessibility

### Font Support

Chinese fonts are supported through the following font stack:
```
'Poppins', 'Noto Sans SC', 'Noto Sans TC', 'Microsoft YaHei', 'Microsoft JhengHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif
```

This ensures proper rendering of both Simplified and Traditional Chinese characters across different platforms.

## OpenSpec Workflow

This project uses [OpenSpec](https://openspec.dev/) for spec-driven development. OpenSpec helps maintain clear specifications and track changes throughout the development process.

### OpenSpec Structure

```
openspec/
├── project.md              # Project context and conventions
├── changes/                # Change proposals
│   └── add-i18n-support/   # Example change proposal
│       ├── proposal.md     # Why and what changes
│       ├── tasks.md        # Implementation checklist
│       ├── design.md       # Technical decisions
│       └── specs/          # Specification deltas
└── specs/                  # Current specifications
```

### Using OpenSpec

1. **Initialize OpenSpec**:
   ```bash
   openspec init
   ```

2. **Create a change proposal**:
   - Create a new directory under `openspec/changes/`
   - Add `proposal.md`, `tasks.md`, and `design.md`
   - Define specification deltas in `specs/`

3. **Validate changes**:
   ```bash
   openspec validate <change-name> --strict
   ```

4. **List active changes**:
   ```bash
   openspec list
   ```

5. **Archive completed changes**:
   ```bash
   openspec archive <change-name>
   ```

### Benefits

- **Clear specifications** - Every feature has well-defined requirements
- **Change tracking** - All modifications are documented
- **Validation** - Ensures specifications meet standards
- **Collaboration** - Team members can understand proposed changes

For more details, see the [OpenSpec documentation](https://openspec.dev/docs).

## Demo

![vCard Desktop Demo](./website-demo-image/desktop.png "Desktop Demo")
![vCard Mobile Demo](./website-demo-image/mobile.png "Mobile Demo")

## Prerequisites

Before you begin, ensure you have met the following requirements:

* [Git](https://git-scm.com/downloads "Download Git") must be installed on your operating system.

## Installing vCard

To install **vCard**, follow these steps:

Linux and macOS:

```bash
sudo git clone https://github.com/codewithsadee/vcard-personal-portfolio.git
```

Windows:

```bash
git clone https://github.com/codewithsadee/vcard-personal-portfolio.git
```

## Contact

If you want to contact me you can reach me at [Twitter](https://www.x.com/codewithsadee_).

## License

MIT
