import { SchemaRegistry, SchemaValues } from '@sprucelabs/schema'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import buildEmitTargetPayloadSchema from '../../utilities/buildEmitTargetAndPayloadSchema'

export default class BuildEmitTargetAndPayloadSchemaTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		await super.beforeEach()
		SchemaRegistry.getInstance().forgetAllSchemas()
	}

	@test()
	protected static builderExists() {
		assert.isFunction(buildEmitTargetPayloadSchema)
	}

	@test()
	protected static builderAddsInOptionalTarget() {
		const schema = buildEmitTargetPayloadSchema({
			id: 'emitPayload',
			fields: {
				textField: {
					type: 'text',
				},
			},
		})

		assert.isTruthy(schema.fields.target)
		assert.isTruthy(schema.fields.target.options.schema.fields.organizationId)
		assert.isTruthy(schema.fields.target.options.schema.fields.locationId)
		assert.isTruthy(schema.fields.payload)
		assert.isTruthy(schema.fields.payload.options.schema.id, 'emitPayload')
	}

	@test()
	protected static buildsWithoutPayload() {
		const schema = buildEmitTargetPayloadSchema({
			id: 'emitPayload',
			fields: {},
		})

		assert.isTruthy(schema.fields.target)
		assert.isTruthy(schema.fields.target.options.schema.fields.organizationId)
		assert.isTruthy(schema.fields.target.options.schema.fields.locationId)
		assert.isFalsy(schema.fields.payload)
	}

	@test('tests typing (tests always pass, types will fail)')
	protected static typesTarget() {
		const schema = buildEmitTargetPayloadSchema({
			id: 'emitPayload',
			fields: {
				textField: {
					type: 'text',
				},
			},
		})

		type TargetAndPayload = SchemaValues<typeof schema>
		const target: TargetAndPayload['target'] = {
			organizationId: 'true',
		}

		assert.isTruthy(target)

		const payload: TargetAndPayload['payload'] = {
			textField: 'hey',
		}

		assert.isTruthy(payload)
	}
}