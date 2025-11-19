cd "$(dirname "$0")/frontend/Kensan"
npm run dev &

cd "$(dirname "$0")/backend"
npm run dev &
