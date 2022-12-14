const origin = process.env.ORIGIN;

const corsOptions = {
  origin: origin || '*',
  optionsSuccessStatus: 200,
  methods: '*',
  preflightContinue: false,
  credentials: true,
}

module.exports = corsOptions
