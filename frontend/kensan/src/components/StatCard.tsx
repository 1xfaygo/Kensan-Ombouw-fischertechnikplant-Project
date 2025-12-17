import React from 'react';

/**
 * 📊 STAT CARD COMPONENT
 * 
 * Dit is een herbruikbare component voor statistiek kaartjes.
 * Je kunt hem meerdere keren gebruiken met verschillende data!
 * 
 * Voorbeeld gebruik:
 * <StatCard 
 *   title="Totaal Productie" 
 *   value="1,234" 
 *   change="+12%" 
 *   color="blue" 
 * />
 */

interface StatCardProps {
  title: string;        // Titel van de kaart
  value: string | number; // Hoofdwaarde (groot getal)
  change?: string;      // Verandering tekst (optioneel)
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange'; // Kleur
  icon?: string;        // Emoji of icon (optioneel)
}

function StatCard({ title, value, change, color = 'blue', icon }: StatCardProps) {
  // Kleur mapping voor de border
  const borderColors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
    orange: 'border-orange-500',
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${borderColors[color]} hover:shadow-lg transition`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
          {change && (
            <p className="text-sm mt-2 text-gray-600">
              {change}
            </p>
          )}
        </div>
        {icon && (
          <span className="text-3xl">{icon}</span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
