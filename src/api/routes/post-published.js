import { AttachmentBuilder, MessageFlags } from 'discord.js'
import h2m from 'html-to-md'

export default function (client) {
  return {
    method: 'POST',
    url: process.env.POST_PUBLISHED_ENDPOINT,
    schema: {
      body: {
        type: 'object',
        properties: {
          post: {
            type: 'object',
            properties: {
              current: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  html: { type: 'string' },
                  feature_image: { type: 'string' },
                  status: {
                    type: 'string',
                    const: 'published'
                  },
                  visibility: {
                    type: 'string',
                    const: 'public'
                  },
                  created_at: {
                    type: 'string',
                    format: 'date-time'
                  },
                  updated_at: {
                    type: 'string',
                    format: 'date-time'
                  },
                  published_at: {
                    type: 'string',
                    format: 'date-time'
                  },
                  tags: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['slug'],
                      properties: {
                        slug: {
                          type: 'string',
                          enum: ['dispatch']
                        }
                      }
                    }
                  },
                  primary_author: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' }
                    },
                    required: ['name']
                  },
                  url: {
                    type: 'string',
                    format: 'uri'
                  }
                },
                required: ['title', 'html', 'status', 'visibility', 'published_at', 'tags', 'primary_author', 'url']
              },
              previous: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['draft', 'scheduled']
                  }
                }
              }
            },
            required: ['current', 'previous']
          }
        },
        required: ['post']
      }
    },
    handler: async (request, reply) => {
      try {
        const post = request.body.post.current
        const newsChannel = await client.channels.fetch(process.env.UNREAL_NEWS_CHANNEL)
        const message = {
          content: `## [${post.title}](${post.url})\n\n${h2m(post.html)}\n_ _`,
          flags: MessageFlags.SuppressEmbeds
        }

        if (post.feature_image) {
          message.files = [new AttachmentBuilder(post.feature_image)]
        }

        const postedMessage = newsChannel.send(message)
        if (postedMessage !== null) {
          postedMessage.crosspost()
        }
        return reply.code(200).send({ message: 'A new dispatch post was published' })
      } catch (error) {
        console.error(`Error processing request: ${error}`)
        return reply.code(500).send({ error: 'An error occured while processing the request' })
      }
    }
  }
}
