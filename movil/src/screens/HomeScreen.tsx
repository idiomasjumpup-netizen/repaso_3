import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { getPublishersApi, Publisher } from "../api/publishers.api";
import { getShippingLabelsApi, ShippingLabel } from "../api/shippingLabels.api";

export default function HomeScreen() {
  const [tab, setTab] = useState<"publishers" | "labels">("publishers");
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [labels, setLabels] = useState<ShippingLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "publishers") {
        const data = await getPublishersApi();
        setPublishers(data);
      } else {
        const data = await getShippingLabelsApi();
        setLabels(data);
      }
    } catch (e: any) {
      setError("Error conectando con la API NoSQL (MongoDB)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Librería Online</Text>
        <Text style={styles.subtitle}>App Móvil - Módulo NoSQL (MongoDB)</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "publishers" && styles.tabActive]}
          onPress={() => setTab("publishers")}
        >
          <Text style={[styles.tabText, tab === "publishers" && styles.tabTextActive]}>Editoriales</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "labels" && styles.tabActive]}
          onPress={() => setTab("labels")}
        >
          <Text style={[styles.tabText, tab === "labels" && styles.tabTextActive]}>Guías de Envío</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#1e40af" style={{ marginVertical: 20 }} />
      ) : tab === "publishers" ? (
        <FlatList
          data={publishers}
          keyExtractor={(item) => item.id || item.code}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name} ({item.code})</Text>
              <Text style={styles.cardDetail}>País: {item.country || "N/A"}</Text>
              <Text style={styles.cardStatus}>Estado: {item.is_active ? "Activo" : "Inactivo"}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay editoriales registradas</Text>}
        />
      ) : (
        <FlatList
          data={labels}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Guía de Envío #{item.tracking_number || item.id}</Text>
              <Text style={styles.cardDetail}>Pedido SQL ID: {item.order_id}</Text>
              <Text style={styles.cardDetail}>Transportista: {item.carrier}</Text>
              <Text style={styles.cardDetail}>Dirección: {item.address}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay guías de envío registradas</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { marginTop: 10, marginBottom: 16, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e3a8a" },
  subtitle: { fontSize: 14, color: "#475569" },
  tabContainer: { flexDirection: "row", marginBottom: 16, borderRadius: 8, backgroundColor: "#e2e8f0", padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 6 },
  tabActive: { backgroundColor: "#1e40af" },
  tabText: { fontWeight: "600", color: "#475569" },
  tabTextActive: { color: "#ffffff" },
  card: { backgroundColor: "#ffffff", padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  cardDetail: { fontSize: 14, color: "#334155", marginTop: 2 },
  cardStatus: { fontSize: 13, color: "#16a34a", marginTop: 4, fontWeight: "500" },
  errorBox: { padding: 14, backgroundColor: "#fee2e2", borderRadius: 8, marginBottom: 12 },
  errorText: { color: "#991b1b", fontWeight: "500" },
  retryButton: { marginTop: 8, backgroundColor: "#dc2626", padding: 8, borderRadius: 4, alignItems: "center" },
  retryText: { color: "#ffffff", fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#94a3b8", marginTop: 20 },
});