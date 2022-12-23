const origin = process.env.ALLOW_ORIGIN;

const corsOptions = {
  origin: origin || '*',
  optionsSuccessStatus: 200,
  methods: '*',
  preflightContinue: false,
  credentials: true,
}

module.exports = corsOptions
