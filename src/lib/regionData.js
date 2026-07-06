// Continent -> Country -> State/City cascading data
export const REGION_DATA = {
  Asia: {
    Bangladesh: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj', 'Jessore', 'Cox\'s Bazar', 'Tangail', 'Pabna'],
    India: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
    Pakistan: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta'],
    'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo'],
    Nepal: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur'],
    Indonesia: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali'],
    Philippines: ['Manila', 'Cebu', 'Davao', 'Quezon City', 'Makati'],
    Thailand: ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Nonthaburi'],
    Vietnam: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho'],
    Malaysia: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Ipoh', 'Kota Kinabalu'],
    Singapore: ['Singapore'],
    Japan: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kyoto'],
    'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'],
    China: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou'],
    UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
    Turkey: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'],
  },
  Europe: {
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh'],
    Germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
    France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Strasbourg'],
    Spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
    Italy: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    Poland: ['Warsaw', 'Krakow', 'Wroclaw', 'Gdansk', 'Poznan'],
    Russia: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    Sweden: ['Stockholm', 'Gothenburg', 'Malmo', 'Uppsala'],
    Denmark: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg'],
    Finland: ['Helsinki', 'Tampere', 'Turku', 'Oulu'],
    Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    Portugal: ['Lisbon', 'Porto', 'Braga', 'Coimbra'],
  },
  'North America': {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Miami', 'Dallas', 'Atlanta', 'Boston', 'Denver'],
    Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg'],
    Mexico: ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun', 'Puebla', 'Tijuana'],
  },
  'South America': {
    Brazil: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
    Argentina: ['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza', 'La Plata'],
    Colombia: ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Cartagena'],
    Chile: ['Santiago', 'Valparaiso', 'Concepcion', 'Antofagasta'],
    Peru: ['Lima', 'Arequipa', 'Cusco', 'Trujillo'],
  },
  Africa: {
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
    Nigeria: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
    Egypt: ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan'],
    Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
    Morocco: ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier'],
  },
  Oceania: {
    Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra'],
    'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Dunedin'],
  },
}

export const CONTINENTS = Object.keys(REGION_DATA)

// Parse a stored region string like "Dhaka, Bangladesh, Asia" back into parts
export function parseRegionString(regionStr) {
  if (!regionStr) return { continent: '', country: '', city: '' }
  const parts = regionStr.split(',').map(s => s.trim())

  // Try to match against known data
  for (const continent of CONTINENTS) {
    for (const country of Object.keys(REGION_DATA[continent])) {
      const cities = REGION_DATA[continent][country]
      for (const city of cities) {
        if (parts.includes(city) || parts.includes(country) || parts.includes(continent)) {
          return {
            continent: parts.find(p => CONTINENTS.includes(p)) || continent,
            country: parts.find(p => Object.keys(REGION_DATA[continent]).includes(p)) || country,
            city: parts.find(p => cities.includes(p)) || '',
          }
        }
      }
    }
  }

  // Fallback: try to match any part against countries or continents
  for (const continent of CONTINENTS) {
    if (parts.includes(continent)) {
      const country = parts.find(p => Object.keys(REGION_DATA[continent]).includes(p)) || ''
      const city = country ? (parts.find(p => REGION_DATA[continent][country]?.includes(p)) || '') : ''
      return { continent, country, city }
    }
    for (const country of Object.keys(REGION_DATA[continent])) {
      if (parts.includes(country) || regionStr === country) {
        return { continent, country, city: parts.find(p => REGION_DATA[continent][country]?.includes(p)) || '' }
      }
    }
  }

  return { continent: '', country: '', city: '' }
}
