for file in *.aac
do
	name=$(basename "$file" .aac)
	out="$name".ogg; ffmpeg -i "$file" "$out"
	rm $file
done
