#!/bin/sh
status=""
echo Changing working Directory

cd output 

pwd

git config --global user.email "<email>"

git config user.name "<user name>"

status=$(git status)


# echo $(awk '/up-to-date/' $status)
if [[ $status == *"staged"*  ]] ;
	then
		git add --all
		git commit -m "Commit message from bash file"
		
		echo "pushed"		
	else
		echo "Nothing to update"		
fi

git push origin gh-pages