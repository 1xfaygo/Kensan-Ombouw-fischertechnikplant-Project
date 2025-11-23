import React from 'react';

/**
 * KLEUREN CONFIGURATIE VOOR KENSAN
 * 
 * Hier definieer je alle kleuren van je design!
 * Pas deze aan naar jouw kleurenpalet.
 * 
 * Gebruik:
 * import { colors } from './config/colors';
 * <div style={{ backgroundColor: colors.primary }}>Content</div>
 */

export const colors = {
  // Primaire kleuren - PAS DEZE AAN NAAR JOUW DESIGN
  primary: '#1E40AF',      // Hoofdkleur (bijv. blauw)
  secondary: '#7C3AED',    // Tweede kleur (bijv. paars)
  accent: '#F59E0B',       // Accentkleur (bijv. oranje)
  
  // Status kleuren
  success: '#10B981',      // Groen voor succes
  warning: '#F59E0B',      // Oranje voor waarschuwingen
  danger: '#EF4444',       // Rood voor fouten
  info: '#3B82F6',         // Blauw voor info
  
  // Neutrale kleuren
  dark: '#1F2937',         // Donker grijs/zwart
  light: '#F3F4F6',        // Licht grijs
  white: '#FFFFFF',        // Wit
  
  // Achtergrond kleuren
  bgPrimary: '#FFFFFF',    // Hoofdachtergrond
  bgSecondary: '#F9FAFB',  // Tweede achtergrond
  bgDark: '#111827',       // Donkere achtergrond
  
  // Tekst kleuren
  textPrimary: '#111827',  // Hoofdtekst
  textSecondary: '#6B7280', // Secundaire tekst
  textLight: '#9CA3AF',    // Lichte tekst
};

/**
 * TAILWIND KLASSEN CONFIGURATIE
 * 
 * Hier zijn handige Tailwind class combinaties die je vaak zult gebruiken
 */
export const styles = {
  // Knoppen
  buttonPrimary: 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium',
  buttonSecondary: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium',
  buttonDanger: 'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium',
  
  // Kaarten
  card: 'bg-white rounded-lg shadow p-6 hover:shadow-lg transition',
  cardBordered: 'bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition',
  
  // Input velden
  input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
  
  // Container
  container: 'max-w-7xl mx-auto px-4',
  section: 'mb-8',
  
  // Headings
  h1: 'text-3xl font-bold text-gray-900 mb-4',
  h2: 'text-2xl font-semibold text-gray-800 mb-3',
  h3: 'text-xl font-semibold text-gray-800 mb-2',
};

export default colors;
