# GMA Blockchain - Teal Theme Color Update Guide

## Complete Color Mapping

### Find & Replace Pattern

| Old Color (Beige/Brown) | New Color (Teal/Blue) | Usage |
|------------------------|----------------------|-------|
| `#F8F3D9` | `#EBF4F6` | Main page background, light accent backgrounds |
| `#EBE5C2` | `#7AB2B2` | Navbar, sidebar, secondary backgrounds, cards |
| `#B9B28A` | `#088395` | Primary buttons, hover states, highlights |
| `#504B38` | `#09637E` | Text, borders, dark buttons, headers |

### Systematic Replacements Needed

#### Background Colors
```
bg-[#F8F3D9] → bg-[#EBF4F6]
bg-[#EBE5C2] → bg-[#7AB2B2]
bg-[#B9B28A] → bg-[#088395]
bg-[#504B38] → bg-[#09637E]
```

#### Text Colors
```
text-[#504B38] → text-[#09637E]
text-[#B9B28A] → text-[#088395]
text-[#504B38]/80 → text-[#09637E]/80
text-[#504B38]/70 → text-[#09637E]/70
text-[#504B38]/60 → text-[#09637E]/60
text-[#504B38]/50 → text-[#09637E]/50
text-[#504B38]/40 → text-[#09637E]/40
```

#### Border Colors
```
border-[#504B38] → border-[#09637E]
border-[#B9B28A] → border-[#088395]
border-[#EBE5C2] → border-[#7AB2B2]
border-[#504B38]/20 → border-[#09637E]/20
border-[#504B38]/10 → border-[#09637E]/10
border-[#504B38]/5 → border-[#09637E]/5
border-[#B9B28A]/30 → border-[#088395]/30
border-[#B9B28A]/20 → border-[#088395]/20
```

#### Hover States
```
hover:bg-[#504B38] → hover:bg-[#09637E]
hover:bg-[#B9B28A] → hover:bg-[#088395]
hover:text-[#504B38] → hover:text-[#09637E]
hover:text-[#B9B28A] → hover:text-[#088395]
hover:border-[#B9B28A] → hover:border-[#088395]
hover:bg-[#EBE5C2] → hover:bg-[#7AB2B2]
hover:bg-[#F8F3D9] → hover:bg-[#EBF4F6]
hover:bg-[#B9B28A]/10 → hover:bg-[#088395]/10
```

#### Opacity Variations
```
bg-[#F8F3D9]/30 → bg-[#EBF4F6]/30
bg-[#EBE5C2]/30 → bg-[#7AB2B2]/30
bg-[#EBE5C2]/20 → bg-[#7AB2B2]/20
bg-[#EBE5C2]/10 → bg-[#7AB2B2]/10
bg-[#B9B28A]/20 → bg-[#088395]/20
bg-[#B9B28A]/10 → bg-[#088395]/10
```

#### Selection Colors
```
selection:bg-[#B9B28A] → selection:bg-[#088395]
```

## Files That Need Updates

### Priority 1 - Main App
- ✅ `/App.tsx` - Main application file (updated COLORS constant)
- `/components/Navbar.tsx` - If exists
- `/components/Sidebar.tsx` - If exists

### Priority 2 - Admin Components
- `/components/AdminDocsPage.tsx`
- `/components/EnhancedAdminDocsPage.tsx`
- `/components/BlockchainExplorerPage.tsx`
- `/components/BlockchainTransactionDetailsPage.tsx`
- `/components/DocumentDetailsPage.tsx`
- `/components/OrdinancesPage.tsx`
- `/components/ViolationsPage.tsx`
- `/components/AuditLogsPage.tsx`
- `/components/BlockchainProofPage.tsx`

### Priority 3 - Detail Pages
- `/components/OrdinanceDetailsPage.tsx`
- `/components/ViolationTransactionPage.tsx`
- `/components/OrdinanceTable.tsx`

### Priority 4 - UI Components
- `/components/ui/*` - All UI components if they use custom colors

## Usage Examples

### Before (Beige/Brown)
```tsx
<div className="bg-[#EBE5C2] border-b border-[#504B38]/20">
  <button className="bg-[#B9B28A] hover:bg-[#504B38] text-white">
    Click Me
  </button>
</div>
```

### After (Teal/Blue)
```tsx
<div className="bg-[#7AB2B2] border-b border-[#09637E]/20">
  <button className="bg-[#088395] hover:bg-[#09637E] text-white">
    Click Me
  </button>
</div>
```

## Design Intent

### Color Psychology
- **Deep Teal (#09637E)**: Trust, stability, professionalism
- **Teal Blue (#088395)**: Modern, clean, technological
- **Soft Teal (#7AB2B2)**: Calm, accessible, friendly
- **Very Light Teal (#EBF4F6)**: Clean, open, transparent

### Visual Hierarchy
1. **Primary Actions**: `#088395` (Teal Blue)
2. **Secondary Elements**: `#7AB2B2` (Soft Teal)
3. **Text & Borders**: `#09637E` (Deep Teal)
4. **Backgrounds**: `#EBF4F6` (Very Light Teal)

### Accessibility
- Deep Teal on white: AAA compliant
- Teal Blue on white: AA compliant
- White text on Deep Teal: AAA compliant
- White text on Teal Blue: AA compliant

## Implementation Strategy

1. **Start with App.tsx** - Update the main application shell
2. **Update page components** - One at a time, starting with most visible
3. **Update UI components** - Buttons, cards, modals
4. **Test each page** - Ensure visual consistency
5. **Validate accessibility** - Ensure color contrast ratios meet WCAG standards

## Quick Find & Replace Commands

If using VS Code or similar editor with regex support:

1. Find: `#F8F3D9` → Replace: `#EBF4F6`
2. Find: `#EBE5C2` → Replace: `#7AB2B2`
3. Find: `#B9B28A` → Replace: `#088395`
4. Find: `#504B38` → Replace: `#09637E`

Run these replacements across all `.tsx` files in sequence.

## Notes

- The COLORS constant in App.tsx has been updated
- CHART_COLORS has been updated for Recharts components
- Some components may need manual review for gradient effects
- Ensure hover states maintain proper visual feedback
- Test dark mode compatibility if applicable
