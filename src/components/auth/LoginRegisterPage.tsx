// 'use client';

// import { useState } from 'react';
// import { Box, Button } from '@mui/material';
// import LoginForm from './LoginForm';
// import RegisterForm from './RegisterForm';

// export default function LoginRegisterPage() {
//   const [mode, setMode] = useState<'login' | 'register'>('login');

//   return (
//     <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
//       {mode === 'login' ? <LoginForm /> : <RegisterForm />}
//       <Button fullWidth onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
//         Switch to {mode === 'login' ? 'Register' : 'Login'}
//       </Button>
//     </Box>
//   );
// }

'use client';

import { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function LoginRegisterPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        p: 4
      }}
    >
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}

      <Button
        fullWidth
        sx={{ mt: 2 }}
        onClick={() =>
          setMode(mode === 'login' ? 'register' : 'login')
        }
      >
        {mode === 'login'
          ? 'Create new account'
          : 'Already have an account? Login'}
      </Button>
    </Paper>
  );
}
