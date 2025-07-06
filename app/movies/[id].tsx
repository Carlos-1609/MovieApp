import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "../../constants/icons";
import { fetchMovieDetails } from "../../services/api";
import useFetch from "../../services/useFetch";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ label, value }) => {
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const validId = typeof id === "string" && id.trim().length > 0;

  // Fetch movie only if the id is valid
  const { data: movie, loading } = useFetch(() =>
    validId ? fetchMovieDetails(id) : Promise.resolve(null)
  );

  useEffect(() => {
    if (!validId) {
      const timeout = setTimeout(() => {
        router.replace("/"); // fallback to Home
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [validId]);

  if (!validId || !movie) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            className="w-full h-[550px]"
            resizeMode="stretch"
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
          />
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.runtime ? `${movie.runtime}m` : "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {movie?.vote_average !== undefined
                ? `${Math.round(movie.vote_average)}/10`
                : "N/A"}
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.vote_count ?? 0} votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={
              movie?.genres && movie.genres.length > 0
                ? movie.genres.map((g) => g.name).join(" - ")
                : "N/A"
            }
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={
                movie?.budget
                  ? `$${(movie.budget / 1_000_000).toFixed(1)} million`
                  : "N/A"
              }
            />
            <MovieInfo
              label="Revenue"
              value={
                movie?.revenue
                  ? `$${(movie.revenue / 1_000_000).toFixed(1)} million`
                  : "N/A"
              }
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies &&
              movie.production_companies.length > 0
                ? movie.production_companies.map((c) => c.name).join(" - ")
                : "N/A"
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/"); // fallback if there's nothing to go back to
          }
        }}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({});
