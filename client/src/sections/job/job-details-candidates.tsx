// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// types
import { IJobCandidate } from 'src/types/job';
// components
import Iconify from 'src/components/iconify';
import { Chip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  candidates: IJobCandidate[];
};

export default function JobDetailsCandidates({ candidates }: Props) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {candidates.map((candidate) => (
        <Stack component={Card} direction="row" spacing={2} key={candidate.id} sx={{ p: 3 }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <Avatar alt={candidate.name} src={candidate.avatarUrl} sx={{ width: 48, height: 48 }} />

          <Stack spacing={2}>
            <ListItemText
              primary={candidate.name}
              secondary={candidate.email}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Percentage: {candidate.matchPercentage}%
            </Typography>

            <Stack spacing={2}>
              <Typography variant="body2">Skills</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                {candidate.skills.slice(0, 2).map((skill: string) => (
                  <Chip key={skill} label={skill} variant="soft" />
                ))}
              </Stack>
            </Stack>
            <Stack spacing={1} direction="row">
              <IconButton
                size="small"
                color="error"
                sx={{
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                  },
                }}
              >
                <Iconify width={18} icon="solar:phone-bold" />
              </IconButton>

              <IconButton
                size="small"
                color="info"
                sx={{
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.16),
                  },
                }}
              >
                <Iconify width={18} icon="solar:chat-round-dots-bold" />
              </IconButton>

              <IconButton
                size="small"
                color="primary"
                sx={{
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                  },
                }}
              >
                <Iconify width={18} icon="fluent:mail-24-filled" />
              </IconButton>

              <Tooltip title="Download CV">
                <IconButton
                  size="small"
                  color="secondary"
                  sx={{
                    borderRadius: 1,
                    bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.16),
                    },
                  }}
                >
                  <Iconify width={18} icon="eva:cloud-download-fill" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      ))}
    </Box>
  );
}
