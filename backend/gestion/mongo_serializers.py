from rest_framework import serializers

class PublisherSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=50, allow_blank=True)
    country = serializers.CharField(max_length=120, allow_blank=True)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)

class ShippingLabelSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    carrier = serializers.CharField(max_length=100, default="SERVIENTREGA")
    tracking_number = serializers.CharField(max_length=100, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    estimated_delivery = serializers.DateTimeField(required=False)
    created_at = serializers.DateTimeField(required=False)