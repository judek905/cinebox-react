import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Badge, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './Logo.jsx';
import SearchBox from './SearchBox.jsx';
import { useWatchlist } from '../context/WatchlistContext.jsx';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'TV Shows', to: '/tv' },
  { label: 'My Watchlist', to: '/watchlist' },
];

// Top bar with logo, navigation and search. On small screens the links move
// into a slide-out drawer opened by the menu button.
export default function Navbar() {
  const { pathname } = useLocation();
  const { items } = useWatchlist();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));
  const label = (item) =>
    item.to === '/watchlist' && items.length > 0 ? (
      <Badge badgeContent={items.length} color="primary" sx={{ '& .MuiBadge-badge': { right: -14, top: 2 } }}>
        {item.label}
      </Badge>
    ) : (
      item.label
    );

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: 'rgba(15,15,17,.94)', backdropFilter: 'blur(10px)', backgroundImage: 'none', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ maxWidth: 1440, width: '100%', mx: 'auto', gap: { xs: 1, md: 3 }, px: { xs: 1.5, sm: 3, md: 6 }, minHeight: { xs: 58, md: 64 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box component={Link} to="/" aria-label="CineBox home" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: 'inherit', textDecoration: 'none', flex: 'none' }}>
            <Logo />
            <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              CineBox
            </Typography>
          </Box>

          <Box component="nav" aria-label="Primary" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                aria-current={isActive(item.to) ? 'page' : undefined}
                sx={{ borderRadius: 999, px: 1.75, fontWeight: 600, color: isActive(item.to) ? 'primary.main' : 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                {label(item)}
              </Button>
            ))}
          </Box>

          <Box sx={{ ml: 'auto', flex: '1 1 auto', maxWidth: 320 }}>
            <SearchBox />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, bgcolor: 'background.paper', backgroundImage: 'none' } }}
      >
        <Box component="nav" aria-label="Mobile" sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 2 }}>
            <Logo />
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>CineBox</Typography>
          </Box>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                selected={isActive(item.to)}
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 2, color: isActive(item.to) ? 'primary.main' : 'text.primary' }}
              >
                <ListItemText primary={label(item)} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
