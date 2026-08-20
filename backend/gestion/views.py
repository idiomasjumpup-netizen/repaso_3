from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from datetime import datetime
from .models import Gate, Flight
from .serializers import GateSerializer, FlightSerializer
from .permissions import IsAdminOrReadOnly
from .mongo import db

class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all().order_by("id")
    serializer_class = GateSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["code"]
    ordering_fields = ["id", "code", "terminal"]

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.select_related("gate").all().order_by("-id")
    serializer_class = FlightSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["gate"]
    search_fields = ["flight_number", "destination", "status", "gate__code"]
    ordering_fields = ["id", "flight_number", "destination", "status", "created_at"]

    def get_permissions(self):
        # Público: SOLO listar vuelos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        flight = serializer.save()
        # Integración automática: Al crear Flight en SQL, registrar un flight_event en NoSQL (Mongo)
        try:
            db["flight_events"].insert_one({
                "flight_id": flight.id,
                "airline_id": "DEFAULT",
                "event_type": "creado",
                "source": "web",
                "note": f"Registro automático al crear vuelo {flight.flight_number} hacia {flight.destination}",
                "created_at": datetime.utcnow()
            })
        except Exception as e:
            # Registrar excepción pero permitir la creación en SQL
            print(f"Error registrando evento inicial en Mongo: {e}")