import { AuthenticateUserDTO, CreateUserDTO } from './auth.types';
import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { pool } from '../../config/database';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
): Promise<AuthTokenResponsePassword['data']> => {
  const signInResponse = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInResponse.error) {
    throw Boom.unauthorized(signInResponse.error.message);
  }

  return signInResponse.data;
};

export const createUserService = async (
  user: CreateUserDTO
): Promise<AuthResponse['data']> => {
  const signUpResponse = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        name: user.name,
        role: user.role,
        storeName: user.storeName,
      },
    },
  });

  if (signUpResponse.error) {
    throw Boom.badRequest(signUpResponse.error.message);
  }

  const supabaseUser = signUpResponse.data.user;
  if (!supabaseUser) throw Boom.badRequest('User creation failed');

// Guardar en DB local
  try {
    await pool.query(
      `INSERT INTO users (id, email, name, role) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [supabaseUser.id, user.email, user.name ?? null, user.role]
    );

    if (user.role === 'store' && user.storeName) {
      await pool.query(
        `INSERT INTO stores (name, "isOpen", "userId") VALUES ($1, $2, $3)`,
        [user.storeName, false, supabaseUser.id]
      );
    }
  } catch (err) {
    console.error('DB sync error (non-fatal):', err);
  }

  return signUpResponse.data;
  };

